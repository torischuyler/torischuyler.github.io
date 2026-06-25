const pythonScript = `import requests
from datetime import datetime
import pytz
import time
import smtplib
from email.mime.text import MIMEText
import logging
from dotenv import load_dotenv
import os
import sys
import json

# Load variables from the .env file into the environment
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# The Space Devs "Launch Library 2" API - free, no key required, returns JSON.
# (The spacex.com/launches page loads its data via JavaScript, so it can't be scraped.)
API_URL = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/"
# The free API tier allows 15 requests/hour. Each check is 1 request, so checking
# every 15 minutes = 4 requests/hour, safely under the limit. Do NOT go below ~4 min.
CHECK_INTERVAL_SECONDS = 900  # 15 minutes
USER_AGENT = "ToriPiLaunchAlert/1.0 (Personal educational project; contact if issues)"

# Alert when SpaceX is the launch provider, or when NASA is involved anywhere
# in the launch (as provider or customer in mission/program agencies).
SPACEX_PROVIDER = "SpaceX"
NASA_AGENCY_NAMES = {"NASA", "National Aeronautics and Space Administration"}
SPACEX_LAUNCHES_URL = "https://www.spacex.com/launches"
NASA_LAUNCH_SCHEDULE_URL = "https://www.nasa.gov/event-type/launch-schedule/"

# File where we remember which alerts were already sent, so a restart/reboot
# doesn't re-send duplicates. Stored next to this script.
SENT_ALERTS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sent_alerts.json")

# Email settings - FILL THESE IN
EMAIL_FROM = os.getenv("EMAIL_FROM")
EMAIL_TO = os.getenv("EMAIL_TO")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

def agency_is_nasa(agency):
    if not agency:
        return False
    if agency.get("name") in NASA_AGENCY_NAMES:
        return True
    if agency.get("abbrev") == "NASA":
        return True
    if agency.get("parent") in NASA_AGENCY_NAMES:
        return True
    return False

def launch_has_nasa_involvement(item):
    if agency_is_nasa(item.get("launch_service_provider")):
        return True
    mission = item.get("mission") or {}
    for agency in mission.get("agencies") or []:
        if agency_is_nasa(agency):
            return True
    for program in item.get("program") or []:
        # ISS lists NASA as one of many partner agencies; skip it so we don't
        # alert on every Progress/Soyuz/HTV launch to the station.
        if program.get("name") == "International Space Station":
            continue
        for agency in program.get("agencies") or []:
            if agency_is_nasa(agency):
                return True
    return False

def should_alert(item):
    provider = (item.get("launch_service_provider") or {}).get("name")
    if provider == SPACEX_PROVIDER:
        return True
    return launch_has_nasa_involvement(item)

def build_hour_alert_body(launch):
    lines = [
        "Get ready!",
        f"{launch['mission']} ({launch['vehicle']}) from {launch['site']}",
        f"Launch: {launch['launch_time']}",
        format_central(launch["launch_time"]),
    ]
    if launch["is_spacex"]:
        lines.append(f"\\nSpaceX launch page: {SPACEX_LAUNCHES_URL}")
    if launch["is_nasa"]:
        lines.append(f"NASA launch schedule: {NASA_LAUNCH_SCHEDULE_URL}")
    return "\\n".join(lines)

def send_email(subject, body):
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM
        msg['To'] = EMAIL_TO
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_FROM, EMAIL_PASSWORD)
            server.send_message(msg)
        logging.info("Email sent successfully")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

def get_upcoming_launches():
    try:
        headers = {"User-Agent": USER_AGENT}
        # Pull the soonest upcoming launches, then filter to our providers below.
        # One request per check keeps us well under the API's 15/hour limit.
        params = {"limit": 100}
        response = requests.get(API_URL, headers=headers, params=params, timeout=30)
        response.raise_for_status()

        now = datetime.now(pytz.utc)
        launches = []
        for item in response.json().get("results", []):
            if not should_alert(item):
                continue
            net = item.get("net")
            if not net:
                continue
            launch_time = datetime.fromisoformat(net.replace("Z", "+00:00"))

            if launch_time > now:
                provider = (item.get("launch_service_provider") or {}).get("name")
                rocket = (item.get("rocket") or {}).get("configuration") or {}
                pad = item.get("pad") or {}
                location = pad.get("location") or {}
                mission = (item.get("mission") or {}).get("name") or item.get("name")
                launches.append({
                    "id": item.get("id"),  # stable unique ID, used to avoid duplicate alerts
                    "provider": provider,
                    "is_spacex": provider == SPACEX_PROVIDER,
                    "is_nasa": launch_has_nasa_involvement(item),
                    "mission": mission,
                    "vehicle": rocket.get("name", "Unknown vehicle"),
                    "site": location.get("name") or pad.get("name", "Unknown site"),
                    "launch_time": launch_time
                })
        return launches
    except Exception as e:
        logging.error(f"Failed to fetch/parse launches: {e}")
        return []

def load_sent_alerts():
    """Load the set of already-sent (launch_id, alert_type) keys from disk."""
    try:
        with open(SENT_ALERTS_FILE) as f:
            return {tuple(pair) for pair in json.load(f)}
    except (FileNotFoundError, ValueError):
        return set()

def save_sent_alerts(sent_alerts):
    """Persist the sent-alerts set so restarts/reboots don't trigger duplicate emails."""
    try:
        with open(SENT_ALERTS_FILE, "w") as f:
            json.dump(sorted(sent_alerts), f)
    except OSError as e:
        logging.error(f"Failed to save sent-alerts file: {e}")

def main():
    logging.info("Launch alert script started")
    # Which alerts we've already sent, so a launch never gets emailed twice.
    # Keys look like (launch_id, "day") or (launch_id, "hour"). Loaded from disk
    # so the memory survives restarts and reboots.
    sent_alerts = load_sent_alerts()

    while True:
        now = datetime.now(pytz.utc)
        launches = get_upcoming_launches()

        for launch in launches:
            launch_id = launch["id"]
            lt = launch["launch_time"]
            readable = format_central(lt)
            seconds_until = (lt - now).total_seconds()

            # ~1 hour before: launch is within the next 60 minutes
            if 0 < seconds_until <= 3600 and (launch_id, "hour") not in sent_alerts:
                subject = f"🚨 Launch in ~1 Hour: {launch['mission']}"
                body = build_hour_alert_body(launch)
                send_email(subject, body)
                sent_alerts.add((launch_id, "hour"))
                save_sent_alerts(sent_alerts)

            # ~1 day before: launch is within the next 24 hours (but more than 1 hour away)
            elif 3600 < seconds_until <= 86400 and (launch_id, "day") not in sent_alerts:
                subject = f"🚀 Launch Tomorrow: {launch['mission']}"
                body = f"{launch['mission']} ({launch['vehicle']}) from {launch['site']}\nLaunch: {lt}\n{readable}"
                send_email(subject, body)
                sent_alerts.add((launch_id, "day"))
                save_sent_alerts(sent_alerts)

        # Forget alerts for launches that are no longer upcoming, to keep the file small.
        # Only prune on a successful fetch so a transient API error doesn't cause re-sends.
        if launches:
            current_ids = {launch["id"] for launch in launches}
            pruned = {key for key in sent_alerts if key[0] in current_ids}
            if pruned != sent_alerts:
                sent_alerts = pruned
                save_sent_alerts(sent_alerts)

        time.sleep(CHECK_INTERVAL_SECONDS)

def format_central(launch_time):
    """Human-readable launch time in US Central time, e.g. 'Thursday June 18, 2026 at 6:18 PM CDT'."""
    central = launch_time.astimezone(pytz.timezone("America/Chicago"))
    date_part = central.strftime("%A, %B ") + str(central.day) + central.strftime(", %Y")
    time_part = central.strftime("%I:%M %p").lstrip("0") + central.strftime(" %Z")
    return f"{date_part} at {time_part}"

def test_alerts():
    logging.info("Running manual test for upcoming launches...")
    launches = get_upcoming_launches()
    
    if not launches:
        logging.info("No upcoming launches found or parsing issue.")
        return
    
    print(f"Found {len(launches)} upcoming launches:")
    for launch in launches[:5]:  # Show first few
        print(launch)
        print(format_central(launch['launch_time']))
    
    # Force a test email for the soonest launch (adjust logic if needed)
    if launches:
        launch = launches[0]  # or pick the one for tomorrow
        subject = f"TEST 🚀 Launch Alert: {launch['mission']}"
        body = (
            f"Test email for:\n{launch['mission']} ({launch['vehicle']}) from {launch['site']}\n"
            f"Launch: {launch['launch_time']}\n"
            f"{format_central(launch['launch_time'])}\n\n"
            "This is just a test from your script."
        )
        send_email(subject, body)
        print("Test email sent! Check your inbox.")

# Run "python launch_alerts.py test" for a one-off test email,
# or "python launch_alerts.py" to start the continuous alert loop.
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        test_alerts()
    else:
        main()
`;

function copyLaunchAlertsScript() {
    navigator.clipboard.writeText(pythonScript).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => btn.textContent = originalText, 2000);
    }).catch(err => {
        console.error('Copy failed', err);
        alert('Failed to copy. Please try again.');
    });
}

document.getElementById('copyBtn').addEventListener('click', copyLaunchAlertsScript);
