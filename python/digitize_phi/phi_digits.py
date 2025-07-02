import sqlite3
import mpmath
import matplotlib.pyplot as plt
import numpy as np
import json
import os
import shutil
import glob
from datetime import datetime


def init_db():
    # Initialize the SQLite database with digits table.
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS digits
                 (day INTEGER PRIMARY KEY, digits TEXT, date TEXT)''')
    conn.commit()
    conn.close()


def backup_db():
    # Backup the database, keeping the last 7 days' backups.
    os.makedirs('backups', exist_ok=True)
    backup_path = f'backups/phi_digits_{datetime.now().strftime("%Y%m%d")}.db'
    shutil.copy('phi_digits.db', backup_path)
    old_backups = sorted(glob.glob('backups/*.db'))[:-7]
    for old in old_backups:
        os.remove(old)


def get_last_day():
    # Retrieve the last processed day from the database.
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    c.execute('SELECT MAX(day) FROM digits')
    last_day = c.fetchone()[0]
    conn.close()
    return last_day if last_day is not None else 0


def compute_phi_digits(day):
    required_dps = day * 10000 + 10
    mpmath.mp.dps = required_dps
    phi_str = mpmath.mp.nstr(mpmath.mp.phi,
                             n=required_dps,
                             strip_zeros=False)[2:]
    start_idx = (day - 1) * 10000
    end_idx = start_idx + 10000
    return phi_str[start_idx:end_idx]


def store_data(day, digits):
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    date = datetime.now().strftime('%Y-%m-%d')
    c.execute('INSERT INTO digits (day, digits, date) VALUES (?, ?, ?)',
              (day, digits, date))
    conn.commit()
    conn.close()


def get_all_digits():
    # Retrieve all digits from the database.
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    c.execute('SELECT digits FROM digits ORDER BY day')
    all_digits = ''.join(row[0] for row in c.fetchall())
    conn.close()
    return all_digits


def generate_daily_visualizations(daily_digits, day, dest_path):
    """
    Generates all daily assets and saves them DIRECTLY to the final
    destination path. No intermediate 'static' folder is used.
    """
    day_str = f"{day:03d}"
    digit_counts = [daily_digits.count(str(i)) for i in range(10)]
    total_count = sum(digit_counts)

    # Define the final destination for archived files
    archive_dest_path = os.path.join(dest_path, 'archives')
    os.makedirs(archive_dest_path, exist_ok=True)

    # Histogram
    plt.figure(figsize=(10, 6))
    bars = plt.bar(range(10), digit_counts, color='goldenrod')
    title_text = (f'Digitize Phi: Daily Histogram (Day {day}, '
                  f'Total New Digits: {total_count})')
    plt.title(title_text)
    plt.xlabel('Digit')
    plt.ylabel('Frequency')
    plt.xticks(range(10))
    for i, bar in enumerate(bars):
        x = bar.get_x() + bar.get_width() / 2
        y = bar.get_height()
        plt.text(x, y, str(digit_counts[i]), ha='center', va='bottom')

    # Save the archived and main histogram directly to the destination
    plt.savefig(os.path.join(archive_dest_path, f'{day_str}_histogram.png'))
    plt.savefig(os.path.join(dest_path, 'histogram.png'))
    plt.close()

    # Artistic representation
    plt.figure(figsize=(20, 20))
    if len(daily_digits) == 10000:
        digits_list = [int(d) for d in daily_digits]
        digits_array = np.array(digits_list).reshape(100, 100)
        # Define 10 distinct colors for digits 0-9
        custom_cmap = plt.get_cmap('tab10')
        plt.imshow(digits_array, cmap=custom_cmap, interpolation='nearest')
    plt.axis('off')
    plt.title(f'Digitize Phi: Daily Digit Map (Day {day})', fontsize=40)

    # Save the archived and main artistic image
    artistic_path = os.path.join(archive_dest_path, f'{day_str}_artistic.png')
    plt.savefig(artistic_path, dpi=200)
    plt.savefig(os.path.join(dest_path, 'artistic.png'), dpi=200)
    plt.close()

    # Save daily digit counts directly to the destination
    archive_filename = f'{day_str}_digit_counts.json'
    archive_counts_path = os.path.join(archive_dest_path, archive_filename)
    with open(archive_counts_path, 'w') as f:
        json.dump(digit_counts, f)
    with open(os.path.join(dest_path, 'digit_counts.json'), 'w') as f:
        json.dump(digit_counts, f)


def update_cumulative_json(all_digits, dest_path):
    """
    Calculates cumulative stats and saves the JSON DIRECTLY to the final
    destination path.
    """
    cumulative_counts = [all_digits.count(str(i)) for i in range(10)]
    output_data = {
        "total_digits": len(all_digits),
        "counts": cumulative_counts
    }

    # Save the cumulative data directly to the destination
    json_filename = 'cumulative_digit_counts.json'
    cumulative_json_path = os.path.join(dest_path, json_filename)
    with open(cumulative_json_path, 'w') as f:
        json.dump(output_data, f, indent=4)


def main():
    """
    Main function with a simplified workflow.
    Generates files and saves them directly to the 'assets' folder.
    """
    # Define the final destination path once.
    dest_path = '../../assets/digitize-phi'

    # Ensure the main destination directory exists.
    os.makedirs(dest_path, exist_ok=True)

    init_db()
    last_day = get_last_day()
    current_day = last_day + 1

    try:
        # 1. Compute daily digits
        daily_digits = compute_phi_digits(current_day)
        if len(daily_digits) != 10000:
            error_msg = (f"Failed to compute the full 10,000 digits. "
                         f"Got {len(daily_digits)}.")
            raise ValueError(error_msg)

        # 2. Store in DB
        store_data(current_day, daily_digits)

        # 3. Backup DB
        backup_db()

        # 4. Generate and save daily assets directly to the destination
        generate_daily_visualizations(daily_digits, current_day, dest_path)

        # 5. Generate and save cumulative assets directly to the destination
        all_digits = get_all_digits()
        update_cumulative_json(all_digits, dest_path)

        print(f'Successfully processed Day {current_day}. '
              f'All assets saved to {os.path.abspath(dest_path)}')

    except Exception as e:
        with open('error.log', 'a') as f:
            f.write(f'Error on day {current_day} at {datetime.now()}: {e}\n')
        print(f"An error occurred on Day {current_day}. Check error.log.")


if __name__ == '__main__':
    main()
