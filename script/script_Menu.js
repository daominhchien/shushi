document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addMenuButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const saveButton = document.querySelector('.save-button');
    const formModal = document.querySelector('.modal');
    const modalTitle = document.querySelector('.modal h3');

    // Open modal
    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Add new "Menu Chi Nhánh"
    addMenuButton.addEventListener('click', function() {
        addMenuChiNhanh();
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal
    closeModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetForm();
        addMenuButton.style.display = 'inline-block';
        saveButton.style.display = 'none';
        modalTitle.textContent = 'Thêm Menu Chi Nhánh';
        formModal.style.backgroundColor = '';
    });

    // Save changes
    saveButton.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

function resetForm() {
    document.querySelector('select[id="MaChiNhanh"]').value = '';
    document.querySelector('select[id="MaMon"]').value = '';
}

async function fetchAllData() {
    try {
        const chinhanhResponse = fetch('http://localhost:3000/chinhanh');
        const monResponse = fetch('http://localhost:3000/monan');

        const [chinhanhData, monData] = await Promise.all([
            chinhanhResponse.then(res => res.json()),
            monResponse.then(res => res.json())
        ]);

        return {
            chinhanh: chinhanhData,
            mon: monData
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
        const { chinhanh, mon } = await fetchAllData();
        populateSelect('MaChiNhanh', chinhanh, 'TenChiNhanh', 'id');
        populateSelect('MaMon', mon, 'TenMonAn', 'id');
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

init();

var menuChiNhanhAPI = 'http://localhost:3000/menuchinhanh';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start() {
    getMenuChiNhanh(renderMenuChiNhanh);
}

function getMenuChiNhanh(callback) {
    fetch(menuChiNhanhAPI)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error fetching menuchinhanh:', error));
}

function createMenuChiNhanh(data, callback) {
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(menuChiNhanhAPI, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error creating menuchinhanh:', error));
}

function deleteMenuChiNhanh(id, callback) {
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(menuChiNhanhAPI + '/' + id, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function() {
            var menuChiNhanhItem = document.querySelector('.menuchinhanh-item-' + id);
            if(menuChiNhanhItem) {
                menuChiNhanhItem.remove();
            }
        })
        .catch(error => console.error('Error deleting menuchinhanh:', error));
}

function updateMenuChiNhanh(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(menuChiNhanhAPI + '/' + id, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error updating menuchinhanh:', error));
}

async function renderMenuChiNhanh(list_menuchinhanh) {
    var listMenuChiNhanh = document.querySelector('tbody');
    if (!listMenuChiNhanh) {
        console.error('No tbody element found');
        return;
    }

    try {
        // Fetch both MonAn and ChiNhanh data
        const [monAnResponse, chiNhanhResponse] = await Promise.all([
            fetch('http://localhost:3000/monan'),
            fetch('http://localhost:3000/chinhanh')
        ]);

        const [monAn, chiNhanh] = await Promise.all([
            monAnResponse.json(),
            chiNhanhResponse.json()
        ]);

        var htmls = list_menuchinhanh.map(function(menu, index) {
            const chiNhanhInfo = chiNhanh.find(cn => cn.id.toString() === menu.MaChiNhanh.toString());
            const monAnInfo = monAn.find(m => m.id.toString() === menu.MaMon.toString());

            return `
                <tr class="menuchinhanh-item-${menu.id}">
                    <td>${index + 1}</td>
                    <td>${menu.MaChiNhanh}</td>
                    <td>${chiNhanhInfo ? chiNhanhInfo.TenChiNhanh : 'Not Found'}</td>
                    <td>${menu.MaMon}</td>
                    <td>${monAnInfo ? monAnInfo.TenMonAn : 'Not Found'}</td>
                    <td class="edit-icons">
                        <button onclick="editMenuChiNhanh('${menu.id}')">✎</button>
                        <button onclick="deleteMenuChiNhanh('${menu.id}', getMenuChiNhanh(renderMenuChiNhanh))">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');

        listMenuChiNhanh.innerHTML = htmls;
        console.log('Rendered HTML:', htmls);

    } catch (error) {
        console.error('Error fetching data:', error);
        listMenuChiNhanh.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
    }
}

function addMenuChiNhanh() {
    var MaChiNhanhInput = document.querySelector('select[id="MaChiNhanh"]');
    var MaMonInput = document.querySelector('select[id="MaMon"]');

    if (MaChiNhanhInput && MaMonInput) {
        var MaChiNhanh = MaChiNhanhInput.value.trim();
        var MaMon = MaMonInput.value.trim();

        if (MaChiNhanh === "" || MaMon === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return;
        }

        // Kiểm tra dữ liệu trùng
        fetch(menuChiNhanhAPI)
            .then(function(response) {
                return response.json();
            })
            .then(function(menuchinhanhs) {
                const isDuplicate = menuchinhanhs.some(function(item) {
                    return item.MaChiNhanh === MaChiNhanh && item.MaMon === MaMon;
                });

                if (isDuplicate) {
                    alert('Menu chi nhánh này đã tồn tại.');
                    return;
                }

                var data = {
                    MaChiNhanh: MaChiNhanh,
                    MaMon: MaMon
                };

                createMenuChiNhanh(data, function() {
                    getMenuChiNhanh(renderMenuChiNhanh);
                    resetForm();
                });
            })
            .catch(error => console.error('Error checking duplicates:', error));
    }
}

function editMenuChiNhanh(id) {
    console.log('editMenuChiNhanh called with id:', id);
    fetch(menuChiNhanhAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(menuchinhanhs) {
            var menuchinhanh = menuchinhanhs.find(function(mcn) {
                return mcn.id == id;
            });

            if (menuchinhanh) {
                var MaChiNhanhInput = document.querySelector('select[id="MaChiNhanh"]');
                var MaMonInput = document.querySelector('select[id="MaMon"]');
                
                // Get UI elements
                var addButton = document.querySelector('#addPlaneButton');
                var saveButton = document.querySelector('.save-button');
                var modalOverlay = document.querySelector('#modalOverlay');
                var modalTitle = document.querySelector('.modal h3');
                var formModal = document.querySelector('.modal');

                // Set form values
                MaChiNhanhInput.value = menuchinhanh.MaChiNhanh;
                MaMonInput.value = menuchinhanh.MaMon;

                // Update UI for edit mode
                modalOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                modalTitle.textContent = 'Chỉnh sửa Menu Chi Nhánh';
                formModal.style.backgroundColor = '#e8f5e9';
                
                // Toggle buttons
                if (addButton) addButton.style.display = 'none';
                if (saveButton) {
                    saveButton.style.display = 'inline-block';
                    console.log('Save button displayed');
                }

                // Handle save
                saveButton.onclick = function() {
                    var updatedData = {
                        MaChiNhanh: MaChiNhanhInput.value,
                        MaMon: MaMonInput.value
                    };

                    // Validate form
                    if (!updatedData.MaChiNhanh || !updatedData.MaMon) {
                        alert("Vui lòng điền đầy đủ thông tin.");
                        return;
                    }

                    // Update menu
                    updateMenuChiNhanh(id, updatedData, function() {
                        getMenuChiNhanh(renderMenuChiNhanh);
                        resetMenuForm();

                        // Reset UI
                        modalTitle.textContent = 'Thêm Menu Chi Nhánh';
                        saveButton.style.display = 'none';
                        addButton.style.display = 'inline-block';
                        modalOverlay.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        formModal.style.backgroundColor = '';
                    });
                };
            }
        })
        .catch(error => console.error('Error editing menu:', error));
}

function resetMenuForm() {
    document.querySelector('select[id="MaChiNhanh"]').value = '';
    document.querySelector('select[id="MaMon"]').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchMenuChiNhanh(searchTerm);
        } else {
            getMenuChiNhanh(renderMenuChiNhanh);
        }
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getMenuChiNhanh(renderMenuChiNhanh);
        }
    });
});

function searchMenuChiNhanh(searchTerm) {
    fetch(menuChiNhanhAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(menuchinhanhs) {
            const filteredMenuChiNhanhs = menuchinhanhs.filter(function(menuchinhanh) {
                const machinhanh = menuchinhanh.MaChiNhanh;

                if (typeof machinhanh === 'string' && typeof searchTerm === 'string') {
                    return machinhanh.toLowerCase() === searchTerm;
                } else if (typeof machinhanh === 'number' && !isNaN(searchTerm)) {
                    return machinhanh === Number(searchTerm);
                } else {
                    return machinhanh.toString().toLowerCase() === searchTerm;
                }
            });
            renderMenuChiNhanh(filteredMenuChiNhanhs);
        })
        .catch(error => console.error('Error searching menuchinhanh:', error));
}