// import HTML data
const modeBtn = document.getElementById('mode');
const modeBtnIcon = document.querySelector('#mode span');
const main = document.body;

// add JS data
const savedMode = localStorage.getItem('mode') || '';

// mode function
modeBtn.addEventListener('click', () => {
    main.classList.toggle('dark');

    setTimeout(() => {
        // delay the transition of the icon change
        modeBtnIcon.textContent = main.classList.contains('dark') ? 'dark_mode' : 'light_mode';
    }, 500);

    // save the mode to local storge
    localStorage.setItem('mode', main.classList.contains('dark') ? 'dark' : 'light');
});

// check the mode from local storage
if(savedMode === 'dark') {
    main.classList.add('dark');
    modeBtnIcon.textContent = main.classList.contains('dark') ? 'dark_mode' : 'light_mode';
}