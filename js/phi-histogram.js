fetch('../assets/digitize-phi/digit_counts.json')
    .then(response => response.json())
    .then(data => {
        const totalCount = data.reduce((sum, count) => sum + count, 0);
        const ctx = document.getElementById('dynamicHistogram').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                datasets: [{
                    label: 'Digit Frequency',
                    data: data,
                    backgroundColor: 'goldenrod'
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                plugins: {
                    title: { display: true, text: `Digitize Phi: All Digits (Total: ${totalCount})` },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => value
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    });
