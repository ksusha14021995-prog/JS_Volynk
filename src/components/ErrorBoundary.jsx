import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          style={{
            padding: 20,
            margin: 20,
            border: '1px solid #dc2626',
            borderRadius: 8,
            background: 'rgba(220, 38, 38, 0.05)',
            color: '#b91c1c',
            fontFamily: 'inherit',
          }}
        >
          <strong>Что-то сломалось при рендере.</strong>
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
            {this.state.error.message ?? String(this.state.error)}
          </div>
          <button
            type="button"
            onClick={this.reset}
            style={{
              marginTop: 12,
              padding: '6px 14px',
              border: '1px solid #b91c1c',
              borderRadius: 6,
              background: 'transparent',
              color: '#b91c1c',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Повторить
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
