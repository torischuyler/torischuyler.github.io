document.addEventListener('DOMContentLoaded', () => {
    // We wrap the code in a DOMContentLoaded listener to ensure the canvas element
    // and all scripts (like Chart.js) are loaded before we try to create the chart.

    // Updated fetch call to point to the new cumulative data file.
    fetch('../assets/digitize-phi/cumulative_digit_counts.json')
        .then(response => {
            if (!response.ok) {
                // If the server responds with an error (e.g., 404 Not Found), throw an error.
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // The old JSON was an array: [990, 1010, ...].
            // The new JSON is an object: { "total_digits": 20000, "counts": [1985, 2011, ...] }.
            // We now access the data via its properties.

            // Get the total number of digits and the frequency counts from the data object.
            const totalDigits = data.total_digits;
            const digitCounts = data.counts;

            const ctx = document.getElementById('dynamicHistogram').getContext('2d');

            // This ensures that if the script were ever re-run, it wouldn't draw a new chart over an old one.
            const existingChart = Chart.getChart(ctx);
            if (existingChart) {
                existingChart.destroy();
            }

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    datasets: [{
                        label: 'Digit Frequency',
                        // Use the 'counts' array from our new JSON object for the chart data.
                        data: digitCounts,
                        backgroundColor: 'goldenrod'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        // Update the title to use the totalDigits from our new JSON object.
                        title: {
                            display: true,
                            // Use toLocaleString() for nice formatting (e.g., "20,000" instead of "20000").
                            text: `Dynamic Histogram (All ${totalDigits.toLocaleString()} Digits)`,
                            padding: {
                                top: 10,
                                bottom: 20
                            },
                            font: {
                                size: 18
                            }
                        },
                        // Your datalabels plugin configuration is preserved.
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            formatter: (value) => value.toLocaleString() // Also format the data labels.
                        }
                    }
                },
                // The ChartDataLabels plugin still needs to be registered.
                plugins: [ChartDataLabels]
            });
        })
        .catch(error => {
            console.error('Error fetching or rendering dynamic histogram:', error);
            const canvasElement = document.getElementById('dynamicHistogram');
            // Display a user-friendly error message on the webpage if the chart fails to load.
            if (canvasElement) {
                const errorP = document.createElement('p');
                errorP.textContent = 'Could not load dynamic histogram data. The data file might be missing.';
                errorP.style.color = 'red';
                errorP.style.textAlign = 'center';
                canvasElement.parentElement.replaceChild(errorP, canvasElement);
            }
        });
});
