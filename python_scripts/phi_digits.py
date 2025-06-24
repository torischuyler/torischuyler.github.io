import sqlite3
import mpmath
import matplotlib.pyplot as plt
import numpy as np
import json
import os
import shutil
import glob
from scipy.stats import chisquare
from datetime import datetime


# Set precision for mpmath
mpmath.mp.dps = 10010  # Slightly more than 10,000


def init_db():
    """Initialize the SQLite database with digits and stats tables."""
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS digits
                 (day INTEGER PRIMARY KEY, digits TEXT, date TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS stats
                 (day INTEGER PRIMARY KEY, chi_pvalue REAL)''')
    conn.commit()
    conn.close()


def backup_db():
    """Backup the database, keeping the last 7 days' backups."""
    os.makedirs('backups', exist_ok=True)
    backup_path = f'backups/phi_digits_{datetime.now().strftime("%Y%m%d")}.db'
    shutil.copy('phi_digits.db', backup_path)
    old_backups = sorted(glob.glob('backups/*.db'))[:-7]
    for old in old_backups:
        os.remove(old)


def get_last_day():
    """Retrieve the last processed day from the database."""
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    c.execute('SELECT MAX(day) FROM digits')
    last_day = c.fetchone()[0]
    conn.close()
    return last_day if last_day is not None else 0


def compute_phi_digits(day):
    """Compute 10,000 digits of phi for the given day."""
    start_idx = max(0, (day - 1) * 10000)
    phi = mpmath.mp.phi
    digits_str = mpmath.mp.nstr(phi, n=10001, strip_zeros=False)[2:]
    return digits_str[start_idx:start_idx + 10000]


def store_data(day, digits, chi_pvalue):
    """Store digits and chi-square p-value in the database."""
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    date = datetime.now().strftime('%Y-%m-%d')
    c.execute('INSERT INTO digits (day, digits, date) VALUES (?, ?, ?)',
              (day, digits, date))
    c.execute('INSERT INTO stats (day, chi_pvalue) VALUES (?, ?)',
              (day, chi_pvalue))
    conn.commit()
    conn.close()


def get_all_digits():
    """Retrieve all digits from the database."""
    conn = sqlite3.connect('phi_digits.db')
    c = conn.cursor()
    c.execute('SELECT digits FROM digits ORDER BY day')
    all_digits = ''.join(row[0] for row in c.fetchall())
    conn.close()
    return all_digits


def chi_square_test(digits):
    """Perform chi-square test on digit distribution."""
    digit_counts = [digits.count(str(i)) for i in range(10)]
    expected = len(digits) / 10
    chi_stat, p_value = chisquare(digit_counts, f_exp=[expected] * 10)
    return {"chi_stat": chi_stat, "p_value": p_value, "counts": digit_counts}


def generate_visualizations(digits, day):
    """Generate histogram and artistic visualizations for the digits."""
    day_str = f"{day:03d}"
    digit_counts = [digits.count(str(i)) for i in range(10)]
    total_count = sum(digit_counts)

    # Histogram
    plt.figure(figsize=(10, 6))
    bars = plt.bar(range(10), digit_counts, color='goldenrod')
    plt.title(f'Digitize Phi: Histogram (Day {day}, '
              f'Total Digits: {total_count})')
    plt.xlabel('Digit')
    plt.ylabel('Frequency')
    plt.xticks(range(10))
    for i, bar in enumerate(bars):
        plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height(),
                 str(digit_counts[i]), ha='center', va='bottom')
    os.makedirs('static/archives', exist_ok=True)
    plt.savefig(f'static/archives/{day_str}_histogram.png')
    plt.savefig('static/histogram.png')
    plt.close()

    # Artistic representation
    plt.figure(figsize=(20, 5))
    digits_array = np.array([int(d) for d in digits[:10000]]).reshape(100, 100)
    plt.imshow(digits_array, cmap='viridis')
    plt.axis('off')
    plt.title(f'Digitize Phi: Digit Map (Day {day})')
    plt.savefig(f'static/archives/{day_str}_artistic.png')
    plt.savefig('static/artistic.png')
    plt.close()

    # Save digit counts
    with open(f'static/archives/{day_str}_digit_counts.json', 'w') as f:
        json.dump(digit_counts, f)
    with open('static/digit_counts.json', 'w') as f:
        json.dump(digit_counts, f)


def main():
    """Main function to compute phi digits, analyze, and visualize."""
    os.makedirs('static', exist_ok=True)
    init_db()
    last_day = get_last_day()
    current_day = last_day + 1

    try:
        digits = compute_phi_digits(current_day)
        chi_result = chi_square_test(digits)
        store_data(current_day, digits, chi_result['p_value'])
        backup_db()
        all_digits = get_all_digits()
        generate_visualizations(all_digits, current_day)
        print(f"Day {current_day}: "
              f"Chi-Square p-value={chi_result['p_value']:.4f}")

        os.makedirs('../assets/digitize-phi/archives', exist_ok=True)
        shutil.copy(f'static/archives/{current_day:03d}_histogram.png',
                    f'../assets/digitize-phi/archives/'
                    f'{current_day:03d}_histogram.png')
        shutil.copy(f'static/archives/{current_day:03d}_artistic.png',
                    f'../assets/digitize-phi/archives/'
                    f'{current_day:03d}_artistic.png')
        shutil.copy(f'static/archives/{current_day:03d}_digit_counts.json',
                    f'../assets/digitize-phi/archives/'
                    f'{current_day:03d}_digit_counts.json')
        shutil.copy('static/histogram.png',
                    '../assets/digitize-phi/histogram.png')
        shutil.copy('static/artistic.png',
                    '../assets/digitize-phi/artistic.png')
        shutil.copy('static/digit_counts.json',
                    '../assets/digitize-phi/digit_counts.json')

    except Exception as e:
        with open('error.log', 'a') as f:
            f.write(f"Error on day {current_day}: {e}\n")


if __name__ == '__main__':
    main()
