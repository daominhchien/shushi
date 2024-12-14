document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addDishButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const saveButton = document.querySelector('.save-button');
    const formModal = document.querySelector('.modal');

    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    addDishButton.addEventListener('click', function() {
        addDish();
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    closeModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
        modalTitle.textContent = 'Thêm Món Ăn';
        formModal.style.backgroundColor = '';
    });

    saveButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

function resetForm() {
    document.querySelector('input[id="TenMonAn"]').value = '';
    document.querySelector('select[id="MaLoai"]').value = '';
    document.querySelector('input[id="GiaHienTai"]').value = '';
    document.querySelector('input[id="URL"]').value = '';
    document.querySelector('input[id="MoTa"]').value = '';
}

async function fetchAllData() {
    try {
        const loaiMonResponse = fetch('http://localhost:3000/loaimon');
        const [loaiMonData] = await Promise.all([
            loaiMonResponse.then(res => res.json())
        ]);

        return {
            loaimon: loaiMonData
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
        const { loaimon } = await fetchAllData();
        populateSelect('MaLoai', loaimon, 'TenLoai', 'id');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

init();

var monAnAPI = 'http://localhost:3000/monan';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start(){
    getMonAn(renderMonAn);
}

function getMonAn(callback){
    fetch(monAnAPI)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(callback)
    .catch(error => console.error('Error fetching monan:', error));
}

function createMonAn(data, callback){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(monAnAPI, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error creating monan:', error));
}

function deleteMonAn(id, callback){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(monAnAPI + '/' + id, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function(){
            var monAnItem = document.querySelector('.monan-item-' + id);
            if(monAnItem){
                monAnItem.remove();
            }
        })
        .catch(error => console.error('Error deleting monan:', error));
}

function updateMonAn(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(monAnAPI + '/' + id, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error updating monan:', error));
}

function renderMonAn(list_monan){
    var listMonAn = document.querySelector('tbody');
    if (!listMonAn) {
        console.error('No tbody element found');
        return;
    }

    var htmls = list_monan.map(function(monan, index) {
        return `
            <tr class="monan-item-${monan.id}">
                <td>${index + 1}</td>
                <td>${monan.id}</td>
                <td>${monan.MaLoai}</td>
                <td>${monan.TenMonAn}</td>
                <td>${monan.GiaHienTai}</td>
                <td>${monan.URL}</td>
                <td>${monan.MoTa}</td>
                <td class="edit-icons">
                    <button onclick="editMonAn('${monan.id}')">✎</button>
                    <button onclick="deleteMonAn('${monan.id}')">🗑️</button>
                </td>
            </tr>`;
    }).join('');

    listMonAn.innerHTML = htmls;
}

function addDish() {
    var TenMonAnInput = document.querySelector('input[id="TenMonAn"]');
    var MaLoaiInput = document.querySelector('select[id="MaLoai"]');
    var GiaHienTaiInput = document.querySelector('input[id="GiaHienTai"]');
    var URLInput = document.querySelector('input[id="URL"]');
    var MoTaInput = document.querySelector('input[id="MoTa"]');

    if (TenMonAnInput && MaLoaiInput && GiaHienTaiInput  && URLInput && MoTaInput) {
        var formData = {
            TenMonAn: TenMonAnInput.value.trim(),
            MaLoai: MaLoaiInput.value.trim(),
            GiaHienTai: GiaHienTaiInput.value.trim(),
            URL: URLInput.value.trim(),
            MoTa: MoTaInput.value.trim()
        };

        if (TenMonAn === '' || MaLoai === '' || GiaHienTai === '' || URL === '' ) {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return;
        }

        createMonAn(formData, function() {
            getMonAn(renderMonAn);
            resetForm();
        });
    }
}

function editMonAn(id) {
    fetch(monAnAPI + '/' + id)
        .then(function(response) {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(function(monan) {
            if (monan) {
                // Populate form fields
                document.querySelector('input[id="TenMonAn"]').value = monan.TenMonAn;
                document.querySelector('select[id="MaLoai"]').value = monan.MaLoai;
                document.querySelector('input[id="GiaHienTai"]').value = monan.GiaHienTai;
                document.querySelector('input[id="URL"]').value = monan.URL;
                document.querySelector('input[id="MoTa"]').value = monan.MoTa;

                // Show modal
                var modalOverlay = document.querySelector('#modalOverlay');
                var addButton = document.querySelector('#addPlaneButton');
                var saveButton = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3');
                var formModal = document.querySelector('.modal');

                modalOverlay.style.display = 'flex';
                addButton.style.display = 'none';
                saveButton.style.display = 'inline-block';
                modalTitle.textContent = 'Chỉnh sửa Món Ăn';
                formModal.style.backgroundColor = '#e8f5e9';
                document.body.style.overflow = 'hidden';

                // Remove existing click handlers
                saveButton.onclick = null;

                // Add new click handler
                saveButton.onclick = function() {
                    var formData = {
                        TenMonAn: document.querySelector('input[id="TenMonAn"]').value.trim(),
                        MaLoai: document.querySelector('select[id="MaLoai"]').value.trim(),
                        GiaHienTai: document.querySelector('input[id="GiaHienTai"]').value.trim(),
                        URL: document.querySelector('input[id="URL"]').value.trim(),
                        MoTa: document.querySelector('input[id="MoTa"]').value.trim()
                    };

                    if (Object.values(formData).some(function(value) { return !value; })) {
                        alert("Vui lòng điền đầy đủ thông tin");
                        return;
                    }

                    updateMonAn(id, formData, function() {
                        getMonAn(renderMonAn);
                        modalOverlay.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        modalTitle.textContent = 'Thêm Món Ăn';
                        addButton.style.display = 'inline-block';
                        saveButton.style.display = 'none';
                        formModal.style.backgroundColor = '';
                        resetForm();
                    });
                };
            }
        })
        .catch(function(error) {
            console.error('Error editing monan:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchMonAn(searchTerm);
        } else {
            getMonAn(renderMonAn);
        }
    });
});

function searchMonAn(searchTerm) {
    fetch(monAnAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(monans) {
            const filteredMonAns = monans.filter(function(monan) {
                return monan.TenMonAn.toLowerCase().includes(searchTerm);
            });
            renderMonAn(filteredMonAns);
        })
        .catch(error => console.error('Error searching monan:', error));
}