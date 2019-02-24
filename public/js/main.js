const closeLabel = document.querySelector('.close');
const openLabel = document.querySelector('input#nav');

function closeMenu() {
    const parent = closeLabel.parentElement;
    parent.style.transform = 'translateX(-105%)';
}

function openMenu() {
    const sibling = openLabel.nextElementSibling;
    sibling.style.transform = 'translateX(0)';
}
closeLabel.addEventListener('click', closeMenu);
openLabel.addEventListener('click', openMenu);