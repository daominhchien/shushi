document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addPlaneButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const saveButton = document.querySelector('.save-button');
    const formModal = document.querySelector('.modal');
    const modalTitle = document.querySelector('.modal h3');

    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    addPlaneButton.addEventListener('click', function() {
        addChiTietPhieuDatMon();
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    closeModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
        addPlaneButton.style.display = 'inline-block';
        saveButton.style.display = 'none';
        modalTitle.textContent = 'Thêm Chi Tiết Phiếu Đặt Món';
        formModal.style.backgroundColor = '';
    });

    saveButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    getChiTietPhieuDatMon(renderChiTietPhieuDatMon);
    init(); // Ensure init is called to populate the select elements
});

function resetForm() {
    document.querySelector('select[id="MaPhieuDatMon"]').value = '';
    document.querySelector('select[id="MaMon"]').value = '';
    document.querySelector('input[id="SoLuong"]').value = '';
}

async function fetchAllData() {
    try {
        const datVeResponse = fetch('http://localhost:3000/datve');
        const taiChoResponse = fetch('http://localhost:3000/taicho');
        const offlineResponse = fetch('http://localhost:3000/offline');
        const monResponse = fetch('http://localhost:3000/monan');

        const [datVeData, taiChoData, offlineData, monData] = await Promise.all([
            datVeResponse.then(res => res.json()),
            taiChoResponse.then(res => res.json()),
            offlineResponse.then(res => res.json()),
            monResponse.then(res => res.json())
        ]);

        console.log('Fetched datve data:', datVeData);
        console.log('Fetched taicho data:', taiChoData);
        console.log('Fetched offline data:', offlineData);
        console.log('Fetched mon data:', monData);

        return {
            datve: datVeData,
            taicho: taiChoData,
            offline: offlineData,
            mon: monData
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function populateSelect(selectId, data, labelKey, valueKey) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) {
        console.error(`Select element with id ${selectId} not found`);
        return;
    }
    if (!Array.isArray(data)) {
        console.error(`Data for select ${selectId} is not an array`, data);
        return;
    }
    selectElement.innerHTML = '<option value="">-- Chọn --</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        selectElement.appendChild(option);
    });
    console.log(`Populated select ${selectId} with data`, data);
}

async function init() {
    try {
        const { datve, taicho, offline, mon } = await fetchAllData();
        const allPhieuDatMon = [...datve, ...taicho, ...offline];
        populateSelect('MaPhieuDatMon', allPhieuDatMon, 'id', 'id');
        populateSelect('MaMon', mon, 'TenMonAn', 'id');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

var chiTietPhieuDatMonAPI = 'http://localhost:3000/chitietphieudatmon';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start() {
    getChiTietPhieuDatMon(renderChiTietPhieuDatMon);
}

function getChiTietPhieuDatMon(callback) {
    fetch(chiTietPhieuDatMonAPI)
        .then(response => response.json())
        .then(callback)
        .catch(error => console.error('Error fetching chitietphieudatmon:', error));
}

function createChiTietPhieuDatMon(data, callback) {
    fetch(chiTietPhieuDatMonAPI, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(callback)
    .catch(error => console.error('Error creating chitietphieudatmon:', error));
}

function updateChiTietPhieuDatMon(id, data, callback) {
    fetch(`${chiTietPhieuDatMonAPI}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(callback)
    .catch(error => console.error('Error updating chitietphieudatmon:', error));
}

function deleteChiTietPhieuDatMon(id, callback) {
    fetch(`${chiTietPhieuDatMonAPI}/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(() => {
        const chiTietPhieuDatMonItem = document.querySelector(`.chitietphieudatmon-item-${id}`);
        if (chiTietPhieuDatMonItem) {
            chiTietPhieuDatMonItem.remove();
        }
    })
    .catch(error => console.error('Error deleting chitietphieudatmon:', error));
}

async function renderChiTietPhieuDatMon(list_chitietphieudatmon) {
    const listChiTietPhieuDatMon = document.querySelector('tbody');
    if (!listChiTietPhieuDatMon) {
        console.error('No tbody element found');
        return;
    }

    try {
        const monAnResponse = await fetch('http://localhost:3000/monan');
        const monAn = await monAnResponse.json();

        const htmls = list_chitietphieudatmon.map((chitietphieudatmon, index) => {
            const mon = monAn.find(m => m.id.toString() === chitietphieudatmon.MaMon.toString());
            const tenMon = mon ? mon.TenMonAn : 'Unknown';

            return `<tr class="chitietphieudatmon-item-${chitietphieudatmon.id}">
                        <td>${index + 1}</td>
                        <td>${chitietphieudatmon.MaPhieuDatMon}</td>
                        <td>${chitietphieudatmon.MaMon}</td>
                        <td>${tenMon}</td>
                        <td>${chitietphieudatmon.SoLuong}</td>
                        <td class="edit-icons">
                            <button onclick="editChiTietPhieuDatMon('${chitietphieudatmon.id}')">✎</button>
                            <button onclick="deleteChiTietPhieuDatMon('${chitietphieudatmon.id}', getChiTietPhieuDatMon(renderChiTietPhieuDatMon))">🗑️</button>
                        </td>
                    </tr>`;
        }).join('');

        listChiTietPhieuDatMon.innerHTML = htmls;
        console.log('Rendered HTML:', htmls);

    } catch (error) {
        console.error('Error fetching MonAn data:', error);
    }
}

function addChiTietPhieuDatMon() {
    const MaPhieuDatMonInput = document.querySelector('select[id="MaPhieuDatMon"]');
    const MaMonInput = document.querySelector('select[id="MaMon"]');
    const SoLuongInput = document.querySelector('input[id="SoLuong"]');

    if (MaPhieuDatMonInput && MaMonInput && SoLuongInput) {
        const MaPhieuDatMon = MaPhieuDatMonInput.value.trim();
        const MaMon = MaMonInput.value.trim();
        const SoLuong = SoLuongInput.value.trim();

        if (MaPhieuDatMon === "" || MaMon === "" || SoLuong === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return;
        }

        fetch(chiTietPhieuDatMonAPI)
            .then(response => response.json())
            .then(chitietphieudatmons => {
                const isDuplicate = chitietphieudatmons.some(item => item.MaPhieuDatMon === MaPhieuDatMon && item.MaMon === MaMon);

                if (isDuplicate) {
                    alert('Chi tiết phiếu đặt món này đã tồn tại.');
                    return;
                }

                const data = {
                    MaPhieuDatMon: MaPhieuDatMon,
                    MaMon: MaMon,
                    SoLuong: SoLuong
                };

                createChiTietPhieuDatMon(data, function() {
                    getChiTietPhieuDatMon(renderChiTietPhieuDatMon);
                    resetForm();
                });
            })
            .catch(error => console.error('Error checking duplicates:', error));
    }
}

function editChiTietPhieuDatMon(id) {
    fetch(chiTietPhieuDatMonAPI)
        .then(response => response.json())
        .then(chitietphieudatmons => {
            const chitietphieudatmon = chitietphieudatmons.find(ctpdm => ctpdm.id == id);

            if (chitietphieudatmon) {
                const MaPhieuDatMonInput = document.querySelector('select[id="MaPhieuDatMon"]');
                const MaMonInput = document.querySelector('select[id="MaMon"]');
                const SoLuongInput = document.querySelector('input[id="SoLuong"]');
                
                const themBtn = document.querySelector('#addPlaneButton');
                const formContainer = document.querySelector('#modalOverlay');
                const saveBtn = document.querySelector('.save-button');
                const modalTitle = document.querySelector('.modal h3');
                const formModal = document.querySelector('.modal');

                MaPhieuDatMonInput.value = chitietphieudatmon.MaPhieuDatMon;
                MaMonInput.value = chitietphieudatmon.MaMon;
                SoLuongInput.value = chitietphieudatmon.SoLuong;

                modalTitle.textContent = 'Chỉnh sửa';
                formModal.style.backgroundColor = '#e8f5e9';

                formContainer.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                themBtn.style.display = 'none';
                saveBtn.style.display = 'inline-block';

                saveBtn.onclick = function() {
                    const MaPhieuDatMon = MaPhieuDatMonInput.value.trim();
                    const MaMon = MaMonInput.value.trim();
                    const SoLuong = SoLuongInput.value.trim();

                    if (MaPhieuDatMon === "" || MaMon === "" || SoLuong === "") {
                        alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
                        return;
                    }

                    const updatedChiTietPhieuDatMon = {
                        MaPhieuDatMon: MaPhieuDatMon,
                        MaMon: MaMon,
                        SoLuong: SoLuong
                    };

                    updateChiTietPhieuDatMon(id, updatedChiTietPhieuDatMon, function() {
                        getChiTietPhieuDatMon(renderChiTietPhieuDatMon);
                        resetForm();

                        modalTitle.textContent = 'Thêm Chi Tiết Phiếu Đặt Món';
                        saveBtn.style.display = 'none';
                        themBtn.style.display = 'inline-block';
                        formContainer.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        formModal.style.backgroundColor = '';
                    });
                };
            }
        })
        .catch(error => console.error('Error editing chitietphieudatmon:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchChiTietPhieuDatMon(searchTerm);
        } else {
            getChiTietPhieuDatMon(renderChiTietPhieuDatMon);
        }
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getChiTietPhieuDatMon(renderChiTietPhieuDatMon);
        }
    });
});

function searchChiTietPhieuDatMon(searchTerm) {
    fetch(chiTietPhieuDatMonAPI)
        .then(response => response.json())
        .then(chitietphieudatmons => {
            const filteredChiTietPhieuDatMons = chitietphieudatmons.filter(chitietphieudatmon => {
                const maphieu = chitietphieudatmon.MaPhieuDatMon.toString().toLowerCase();
                return maphieu.includes(searchTerm);
            });
            renderChiTietPhieuDatMon(filteredChiTietPhieuDatMons);
        })
        .catch(error => console.error('Error searching chitietphieudatmon:', error));
}