function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <h3>
            <span>&lt;</span>Asad<span>/&gt;</span>
          </h3>

          <p>Building the future with technology.</p>
        </div>

        <div className="footer-socials">
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            <i className="fab fa-github" />
          </a>

          <a href="https://linkedin.com/" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>

        <p className="copyright">
          © {year} Asad Ali. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;