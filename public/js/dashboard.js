document.addEventListener('DOMContentLoaded', function(){
  const copyBtn = document.getElementById('copyLinkBtn');
  const siteInput = document.getElementById('siteLink');
  if(copyBtn && siteInput){
    copyBtn.addEventListener('click', async function(){
      const link = copyBtn.dataset.link || siteInput.value;
      try{
        await navigator.clipboard.writeText(link);
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.disabled = true;
        setTimeout(()=>{ copyBtn.textContent = prev; copyBtn.disabled = false; }, 1800);
      }catch(e){
        // fallback
        siteInput.select();
        document.execCommand('copy');
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(()=>{ copyBtn.textContent = prev; }, 1800);
      }
    });
  }

  // Delete modal logic
  const deleteBtn = document.getElementById('deleteBtn');
  const deleteModal = document.getElementById('deleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDelete');

  if (deleteBtn && deleteModal && cancelDeleteBtn) {
    deleteBtn.addEventListener('click', () => {
      deleteModal.style.display = 'flex';
    });

    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.style.display = 'none';
    });

    // Also hide modal if user clicks outside of the modal content
    window.addEventListener('click', (event) => {
      if (event.target == deleteModal) {
        deleteModal.style.display = 'none';
      }
    });
  }
});
