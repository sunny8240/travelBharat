export default function LottiePlaceholder({
  title = "No Data Found",
  message = "Try adjusting your search or filters",
  src = "https://lottie.host/embed/f9ebd175-d47d-4f53-bcb5-9cc100bdfe13/a6aMlzIDaZ.lottie"
}) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: 'var(--muted)',
      fontFamily: 'var(--body)'
    }}>
      <iframe
        src={src}
        title="Coming soon animation"
        style={{
          border: 'none',
          width: '100%',
          maxWidth: '480px',
          height: '360px',
          margin: '0 auto 20px auto',
          display: 'block'
        }}
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <h2 style={{
        fontFamily: 'var(--heading)',
        fontSize: '1.8rem',
        marginBottom: '12px',
        color: 'var(--dark)'
      }}>
        {title}
      </h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
        {message}
      </p>
    </div>
  );
}
