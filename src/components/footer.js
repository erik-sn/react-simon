import React from 'react';

const Footer = () => {
  return (
    <div className="footer" onClick={() => window.open('https://github.com/kiresuah/react-simon', '_blank')}>
      <img height="55" src="https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png" alt="github" />
      <span id="info-tab">Application created by Erik Niehaus</span>
    </div>
  );
}

export default Footer;
