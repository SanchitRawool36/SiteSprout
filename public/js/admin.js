(function(){
  const colorInput = document.getElementById('themeColor');
  function updateColor(value){
    document.documentElement.style.setProperty('--theme-color', value);
    const ph = document.querySelector('.preview-header');
    if(ph) ph.style.backgroundColor = value;
  }
  if(colorInput){
    colorInput.addEventListener('input', (e) => updateColor(e.target.value));
    updateColor(colorInput.value || '#0a63d3');
  }

  // Live text preview
  const nameInput = document.getElementById('name');
  const descInput = document.getElementById('description');
  const previewName = document.getElementById('previewName');
  const previewDesc = document.getElementById('previewDescription');
  const businessTypeSelect = document.getElementById('businessType');
  const previewType = document.getElementById('previewType');
  function updateText(){
    if(previewName) previewName.textContent = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Your Restaurant';
    if(previewDesc) previewDesc.textContent = descInput && descInput.value.trim() ? descInput.value.trim() : 'Short description will appear here.';
  }
  if(nameInput) nameInput.addEventListener('input', updateText);
  if(descInput) descInput.addEventListener('input', updateText);
  updateText();
  if(businessTypeSelect && previewType){
    businessTypeSelect.addEventListener('change', ()=>{ previewType.textContent = 'Type: ' + (businessTypeSelect.value || 'Restaurant'); });
    previewType.textContent = 'Type: ' + (businessTypeSelect.value || 'Restaurant');
  }

  // Categories & items builder
  const categoriesContainer = document.getElementById('categoriesContainer');
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  const menuJsonInput = document.getElementById('menuJson');
  const form = document.querySelector('.admin-form');

  function createItemRow(itemName='', itemPrice=''){
    const row = document.createElement('div');
    row.className = 'menu-item-row';
    const name = document.createElement('input'); name.type='text'; name.placeholder='Item name'; name.className='item-name'; name.value = itemName;
    const price = document.createElement('input'); price.type='number'; price.step='0.01'; price.placeholder='Price'; price.className='item-price'; price.value = itemPrice;
    const desc = document.createElement('input'); desc.type='text'; desc.placeholder='Description (optional)'; desc.className='item-desc';
    const remove = document.createElement('button'); remove.type='button'; remove.className='btn remove-item'; remove.textContent='✕';
    remove.addEventListener('click', ()=> row.remove());
    row.appendChild(name); row.appendChild(price); row.appendChild(desc); row.appendChild(remove);
    return row;
  }

  function createCategoryBlock(categoryName=''){
    const block = document.createElement('div'); block.className='category-block';
    const header = document.createElement('div'); header.className='category-header';
    const title = document.createElement('input'); title.type='text'; title.placeholder='Category name (e.g., Starters)'; title.className='category-name'; title.value = categoryName;
    const removeCat = document.createElement('button'); removeCat.type='button'; removeCat.className='btn remove-cat'; removeCat.textContent='Remove Category';
    removeCat.addEventListener('click', ()=> block.remove());
    header.appendChild(title); header.appendChild(removeCat);

    const itemsWrap = document.createElement('div'); itemsWrap.className='items-wrap';
    const addItemBtn = document.createElement('button'); addItemBtn.type='button'; addItemBtn.className='btn ghost add-item'; addItemBtn.textContent='+ Add Item';
    addItemBtn.addEventListener('click', ()=>{
      const r = createItemRow(); itemsWrap.appendChild(r);
    });

    block.appendChild(header);
    block.appendChild(itemsWrap);
    block.appendChild(addItemBtn);
    return block;
  }

  if(addCategoryBtn && categoriesContainer){
    addCategoryBtn.addEventListener('click', ()=>{
      const cb = createCategoryBlock();
      categoriesContainer.appendChild(cb);
      // add one empty item by default
      const addBtn = cb.querySelector('.add-item'); addBtn.click();
    });
  }

  // Serialize categories into JSON for form submit
  function buildMenuJson(){
    const categories = Array.from(document.querySelectorAll('.category-block'));
    const out = categories.map(cat => {
      const categoryName = (cat.querySelector('.category-name') || {}).value || '';
      const items = Array.from(cat.querySelectorAll('.menu-item-row')).map(r => {
        const n = (r.querySelector('.item-name') || {}).value || '';
        const p = (r.querySelector('.item-price') || {}).value || '';
        const d = (r.querySelector('.item-desc') || {}).value || '';
        return { name: n, price: p === '' ? null : Number(p), description: d };
      }).filter(i => i.name);
      return { category: categoryName, items };
    }).filter(c => c.items.length>0 || c.category);
    return out;
  }

  if(form){
    form.addEventListener('submit', (e)=>{
      const menuData = buildMenuJson();
      if(menuJsonInput) menuJsonInput.value = JSON.stringify(menuData);
      // allow submit to continue
    });
  }

  // Optional: initialize with one category
  function initializeMenu() {
    if (typeof rawMenuData !== 'undefined' && rawMenuData.length > 0) {
      categoriesContainer.innerHTML = ''; // Clear any existing content
      rawMenuData.forEach(catData => {
        const cb = createCategoryBlock(catData.category);
        categoriesContainer.appendChild(cb);
        if (catData.items && catData.items.length > 0) {
          const itemsWrap = cb.querySelector('.items-wrap');
          catData.items.forEach(itemData => {
            const itemRow = createItemRow(itemData.name, itemData.price);
            // Note: The original 'createItemRow' doesn't handle description.
            // You might want to enhance it to set the description value as well.
            const descInput = itemRow.querySelector('.item-desc');
            if (descInput && itemData.description) {
              descInput.value = itemData.description;
            }
            itemsWrap.appendChild(itemRow);
          });
        }
      });
    } else if (categoriesContainer.children.length === 0) {
      const cb = createCategoryBlock('Mains');
      categoriesContainer.appendChild(cb);
      cb.querySelector('.add-item').click();
    }
  }

  if (categoriesContainer) {
    initializeMenu();
  }

  // Image removal logic
  document.addEventListener('DOMContentLoaded', () => {
    const removedImagesInput = document.getElementById('removedImages');
    const removeImageBtns = document.querySelectorAll('.remove-image');
    let removedImages = [];

    removeImageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const imageUrl = btn.dataset.imageUrl;
        const container = btn.closest('.gallery-image-container');
        if (imageUrl && container) {
          container.style.display = 'none';
          removedImages.push(imageUrl);
          removedImagesInput.value = removedImages.join(',');
        }
      });
    });
  });

})();
