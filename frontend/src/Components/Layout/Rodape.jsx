function Rodape() {
  return (
    <footer>
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Hotel Management System. All rights
          reserved.
        </p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Crafted with care | Powered by Modern Web Technologies
        </p>
      </div>
    </footer>
  );
}

export default Rodape; 