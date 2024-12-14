document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const hoaDonAPI = 'http://localhost:3000/hoadon';

    // Initialize the page by fetching and rendering the data
    start();

    function start() {
        getHoaDon(renderHoaDon);
    }

    // Fetch the list of invoices from the API
    function getHoaDon(callback) {
        fetch(hoaDonAPI)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(callback)
            .catch(error => console.error('Error fetching hoadon:', error));
    }

    // Render the list of invoices
    function renderHoaDon(list_hoadon) {
        const listHoaDon = document.querySelector('tbody');
        if (!listHoaDon) {
            console.error('No tbody element found');
            return;
        }

        const htmls = list_hoadon.map(function (hoadon, index) {
            return `<tr class="hoadon-item-${hoadon.id}">
                        <td>${index + 1}</td>
                        <td>${hoadon.id}</td>
                        <td>${hoadon.MaPhieuDatMon}</td>
                        <td>${hoadon.TongTien}</td>
                        <td>${hoadon.SoTienGiam}</td>
                        <td>${hoadon.SoTienThanhToan}</td>
                    </tr>`;
        }).join('');

        listHoaDon.innerHTML = htmls;
        console.log('Rendered HTML:', htmls);
    }

    // Search functionality
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchHoaDon(searchTerm);
        } else {
            getHoaDon(renderHoaDon); // Show full list if search input is empty
        }
    });

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getHoaDon(renderHoaDon); // Show full list if search input is empty
        }
    });

    function searchHoaDon(searchTerm) {
        fetch(hoaDonAPI)
            .then(function (response) {
                return response.json();
            })
            .then(function (hoadons) {
                const filteredHoaDons = hoadons.filter(function (hoadon) {
                    const id = hoadon.id;

                    if (typeof id === 'string' && typeof searchTerm === 'string') {
                        return id.toLowerCase() === searchTerm;
                    } else if (typeof id === 'number' && !isNaN(searchTerm)) {
                        return id === Number(searchTerm);
                    } else {
                        return id.toString().toLowerCase() === searchTerm;
                    }
                });
                renderHoaDon(filteredHoaDons);
            })
            .catch(error => console.error('Error searching hoadon:', error));
    }
});