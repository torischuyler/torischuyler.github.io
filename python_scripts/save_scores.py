import json
import csv
import datetime
from io import StringIO
from js import document, window, encodeURIComponent
from pyodide.ffi import create_proxy


def save_scores_to_csv(*args, **kwargs):
    # Parse JSON string from JavaScript
    scores = json.loads(args[0])

    # Prepare CSV
    output = StringIO()
    writer = csv.writer(output)
    headers = ['Date', 'Mystical', 'Cute', 'Chaos', 'Positive',
               'Savage', 'History', 'Tech', 'Renegade']
    values = [
        datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ] + [
        scores.get(key.lower(), 0) for key in headers[1:]
    ]
    writer.writerow(headers)
    writer.writerow(values)

    # Create download link
    blob = document.createElement('a')
    csv_content = encodeURIComponent(output.getvalue())
    blob.href = 'data:text/csv;charset=utf-8,' + csv_content
    blob.download = 'meme_quiz_scores.csv'
    blob.click()

# Expose function to JavaScript


window.saveScoresToCSV = create_proxy(save_scores_to_csv)
