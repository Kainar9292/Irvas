import {scrollWindow} from './modals';

const images = () => {
    const imgPopup = document.createElement('div'),
          workSection = document.querySelector('.works'),
          bigImage = document.createElement('img'),
          body = document.querySelector('body');

    imgPopup.classList.add('popup');
    workSection.appendChild(imgPopup);

    imgPopup.style.justifyContent = 'center';
    imgPopup.style.alignItems = 'center';
    imgPopup.style.display = 'none';
    
    bigImage.classList.add('faded');

    imgPopup.appendChild(bigImage);

    workSection.addEventListener('click', (e) => {
        e.preventDefault();

        let target = e.target;

        if (target && target.classList.contains('preview')) {
            imgPopup.style.display = 'flex';
            const path = target.parentNode.getAttribute('href');
            bigImage.setAttribute('src', path);
            body.style.overflow = 'hidden';
            bigImage.style.maxWidth = '80%';
            bigImage.style.borderRadius = '5px';

            document.body.style.marginRight = `${scrollWindow}px`;
        }

        if (target && target.matches('div.popup')) {
            imgPopup.style.display = 'none';
            body.style.overflow = '';
            document.body.style.marginRight = `0px`;
        }
    });

};

export default images;