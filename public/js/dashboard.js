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
});
