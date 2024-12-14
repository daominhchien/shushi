document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addCardButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const saveButton = document.querySelector('.save-button');
    const formModal = document.querySelector('.modal');

    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    addCardButton.addEventListener('click', function() {  
        addTheKhachHang();
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    closeModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
        modalTitle.textContent = 'Thêm Thẻ Khách Hàng';
        formModal.style.backgroundColor = '';
    });
});

function resetForm() {
    document.querySelector('select[id="MaKhachHang"]').value = '';
    document.querySelector('select[id="MaNhanVien"]').value = '';
    document.querySelector('select[id="LoaiThe"]').value = '';
    document.querySelector('input[id="NgayLap"]').value = '';
    document.querySelector('input[id="DiemTichLuy"]').value = '';
}

async function fetchAllData() {
    try {
        const nhanVienResponse = fetch('http://localhost:3000/nhanvien');
        const khachHangResponse = fetch('http://localhost:3000/khachhang');
        const theKhachHangResponse = fetch('http://localhost:3000/thekhachhang');

        const [nhanVienData, khachHangData, theKhachHangData] = await Promise.all([
            nhanVienResponse.then(res => res.json()),
            khachHangResponse.then(res => res.json()),
            theKhachHangResponse.then(res => res.json())
        ]);

        return {
            nhanvien: nhanVienData,
            khachhang: khachHangData,
            thekhachhang: theKhachHangData
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

function populateSelect(selectId, data, labelKey, valueKey) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '<option value="">-- Chọn --</option>';
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        selectElement.appendChild(option);
    });
}

async function init() {
    try {
        const { nhanvien, khachhang, thekhachhang } = await fetchAllData();
        populateSelect('MaNhanVien', nhanvien, 'HoTen', 'id');
        populateSelect('MaKhachHang', khachhang, 'HoTen', 'id');
        renderTheKhachHang(thekhachhang, khachhang);
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}


init();

var theKhachHangAPI = 'http://localhost:3000/thekhachhang';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start(){
    getTheKhachHang(renderTheKhachHang);
}

function getTheKhachHang(callback){
    fetch(theKhachHangAPI)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error fetching thekhachhang:', error));
}

function createTheKhachHang(data, callback){
    fetch(theKhachHangAPI, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(callback)
    .catch(error => console.error('Error creating thekhachhang:', error));
}

function deleteTheKhachHang(id){
    fetch(`${theKhachHangAPI}/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(() => {
        const theKhachHangItem = document.querySelector('.thekhachhang-item-' + id);
        if(theKhachHangItem) theKhachHangItem.remove();
    })
    .catch(error => console.error('Error deleting thekhachhang:', error));
}

function updateTheKhachHang(id, data, callback) {
    fetch(`${theKhachHangAPI}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(callback)
    .catch(error => console.error('Error updating thekhachhang:', error));
}





async function renderTheKhachHang(list_thekhachhang) {
    var listTheKhachHang = document.querySelector('tbody');
    if (!listTheKhachHang) {
        console.error('No tbody element found');
        return;
    }

    try {
        
        const khachHangResponse = await fetch('http://localhost:3000/khachhang');
        const khachHang = await khachHangResponse.json();

        var htmls = list_thekhachhang.map(function(thekhachhang, index) {
            
            const kh = khachHang.find(k => k.id.toString() === thekhachhang.MaKhachHang.toString());
            const hoTen = kh ? kh.HoTen : 'Unknown';

            return `<tr class="thekhachhang-item-${thekhachhang.id}">
                        <td>${index + 1}</td>
                        <td>${thekhachhang.id}</td>
                        <td>${thekhachhang.MaKhachHang}</td>
                        <td>${hoTen}</td>
                        <td>${thekhachhang.MaNhanVien}</td>
                        <td>${thekhachhang.LoaiThe}</td>
                        <td>${thekhachhang.NgayLap}</td>
                        <td>${thekhachhang.DiemTichLuy}</td>
                        <td class="edit-icons">
                            <button onclick="editTheKhachHang('${thekhachhang.id}')">✎</button>
                            <button onclick="deleteTheKhachHang('${thekhachhang.id}')">🗑️</button>
                        </td>
                    </tr>`;
        }).join('');

        listTheKhachHang.innerHTML = htmls;

    } catch (error) {
        console.error('Error fetching KhachHang data:', error);
    }
}



// Add this new function
function checkMaKhachHangExists(maKhachHang, callback) {
    fetch('http://localhost:3000/TheKhachHang')
        .then(response => response.json())
        .then(data => {
            const exists = data.some(item => item.MaKhachHang === maKhachHang);
            callback(exists);
        })
        .catch(error => console.error('Error:', error));
}


function addTheKhachHang() {
    const formData = {
        MaKhachHang: document.querySelector('#MaKhachHang').value,
        MaNhanVien: document.querySelector('#MaNhanVien').value,
        LoaiThe: document.querySelector('#LoaiThe').value,
        NgayLap: document.querySelector('#NgayLap').value,
        DiemTichLuy: document.querySelector('#DiemTichLuy').value
    };

    if (Object.values(formData).some(value => !value)) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }

    checkMaKhachHangExists(formData.MaKhachHang, (exists) => {
        if (exists) {
            alert("Mã khách hàng đã tồn tại. Vui lòng chọn mã khác!");
            return;
        }
        
        createTheKhachHang(formData, () => {
            getTheKhachHang(renderTheKhachHang);
            resetForm();
        });
    });
}

function editTheKhachHang(id) {
    fetch(theKhachHangAPI)
        .then(response => response.json())
        .then(cards => {
            const card = cards.find(c => c.id === id);
            if (card) {
                populateFormForEdit(card);
                setupEditModal();
                setupSaveHandler(id, card);
            }
        })
        .catch(error => console.error('Error editing thekhachhang:', error));
}

function populateFormForEdit(card) {
    document.querySelector('#MaKhachHang').value = card.MaKhachHang;
    document.querySelector('#MaNhanVien').value = card.MaNhanVien;
    document.querySelector('#LoaiThe').value = card.LoaiThe;
    document.querySelector('#NgayLap').value = card.NgayLap;
    document.querySelector('#DiemTichLuy').value = card.DiemTichLuy;
}

function setupEditModal() {
    const modalElements = {
        modalOverlay: document.querySelector('#modalOverlay'),
        addButton: document.querySelector('#addPlaneButton'),
        saveButton: document.querySelector('.save-button'),
        modalTitle: document.querySelector('.modal h3'),
        modal: document.querySelector('.modal')
    };

    modalElements.modalTitle.textContent = 'Chỉnh sửa Thẻ';
    modalElements.modal.style.backgroundColor = '#e8f5e9';
    modalElements.modalOverlay.style.display = 'flex';
    modalElements.addButton.style.display = 'none';
    modalElements.saveButton.style.display = 'inline-block';
    document.body.style.overflow = 'hidden';
}

function setupSaveHandler(id) {
    const saveButton = document.querySelector('.save-button');
    saveButton.onclick = function() {
        const updatedData = {
            MaKhachHang: document.querySelector('#MaKhachHang').value,
            MaNhanVien: document.querySelector('#MaNhanVien').value,
            LoaiThe: document.querySelector('#LoaiThe').value,
            NgayLap: document.querySelector('#NgayLap').value,
            DiemTichLuy: document.querySelector('#DiemTichLuy').value
        };

        if (Object.values(updatedData).some(value => !value)) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        updateTheKhachHang(id, updatedData, () => {
            getTheKhachHang(renderTheKhachHang);
            resetForm();
            document.querySelector('#modalOverlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    };
}
function editTheKhachHang(id) {
    fetch(theKhachHangAPI + '/' + id)
        .then(function(response) {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(function(theKhachHang) {
            if (theKhachHang) {
                // Populate form fields
                document.querySelector('select[id="MaNhanVien"]').value = theKhachHang.MaNhanVien;
                document.querySelector('select[id="MaKhachHang"]').value = theKhachHang.MaKhachHang;
                document.querySelector('select[id="LoaiThe"]').value = theKhachHang.LoaiThe;
                document.querySelector('input[id="NgayLap"]').value = theKhachHang.NgayLap;
                document.querySelector('input[id="DiemTichLuy"]').value = theKhachHang.DiemTichLuy;

                // Show modal
                var modalOverlay = document.querySelector('#modalOverlay');
                var addButton = document.querySelector('#addPlaneButton');
                var saveButton = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3');
                var formModal = document.querySelector('.modal');

                modalOverlay.style.display = 'flex';
                addButton.style.display = 'none';
                saveButton.style.display = 'inline-block';
                modalTitle.textContent = 'Chỉnh sửa Thẻ Khách Hàng';
                formModal.style.backgroundColor = '#e8f5e9';
                document.body.style.overflow = 'hidden';

             
                saveButton.onclick = null;

                saveButton.onclick = function() {
                    var formData = {
                        MaNhanVien: document.querySelector('select[id="MaNhanVien"]').value,
                        MaKhachHang: document.querySelector('select[id="MaKhachHang"]').value,
                        LoaiThe: document.querySelector('select[id="LoaiThe"]').value,
                        NgayLap: document.querySelector('input[id="NgayLap"]').value,
                        DiemTichLuy: document.querySelector('input[id="DiemTichLuy"]').value
                    };

                    if (Object.values(formData).some(function(value) { return !value; })) {
                        alert("Vui lòng điền đầy đủ thông tin");
                        return;
                    }

                    updateTheKhachHang(id, formData, function() {
                        getTheKhachHang(renderTheKhachHang);
                        modalOverlay.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        modalTitle.textContent = 'Thêm Thẻ Khách Hàng';
                        addButton.style.display = 'inline-block';
                        saveButton.style.display = 'none';
                        formModal.style.backgroundColor = '';
                        resetForm();
                    });
                };
            }
        })
        .catch(function(error) {
            console.error('Error editing thekhachhang:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchTheKhachHang(searchTerm);
        } else {
            getTheKhachHang(renderTheKhachHang); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });

    // Tìm kiếm ngay khi người dùng gõ (khi ô tìm kiếm trống sẽ hiện lại toàn bộ)
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getTheKhachHang(renderTheKhachHang); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });
});

function searchTheKhachHang(searchTerm) {
    fetch(theKhachHangAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(cards) {
            const filteredCards = cards.filter(function(card) {
                const id = card.id; // Giá trị id của thẻ khách hàng
                const maKhachHang = card.MaKhachHang; // Giá trị MaKhachHang của thẻ khách hàng

                // Chuyển searchTerm sang số nếu có thể
                const searchTermAsNumber = !isNaN(searchTerm) ? Number(searchTerm) : null;

                // So sánh searchTerm với id hoặc MaKhachHang
                if (typeof id === 'string' && id.toLowerCase() === searchTerm) {
                    return true;
                }

                if (typeof maKhachHang === 'string' && maKhachHang.toLowerCase().includes(searchTerm)) {
                    return true;
                }

                if (typeof id === 'number' && id === searchTermAsNumber) {
                    return true;
                }

                if (typeof maKhachHang === 'number' && maKhachHang === searchTermAsNumber) {
                    return true;
                }

                return false;
            });
            renderTheKhachHang(filteredCards);
        })
        .catch(error => console.error('Error searching thekhachhang:', error));
}
