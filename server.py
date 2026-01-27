#!/usr/bin/env python3
"""
Custom HTTP server for Unity WebGL builds with Brotli compression support.
Handles .br and .gz files with proper Content-Encoding headers.
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 8000

class UnityWebGLHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for Unity WebGL builds with compression support."""
    
    def guess_type(self, path):
        """Override to handle compressed files correctly."""
        # Remove compression extensions to get the real file type
        if path.endswith('.br'):
            path = path[:-3]  # Remove .br
        elif path.endswith('.gz'):
            path = path[:-3]  # Remove .gz
        
        return super().guess_type(path)

    
    def send_head(self):
        """Override to handle compressed files and set correct headers."""
        path = self.translate_path(self.path)
        f = None
        
        # Check if requested file exists or if a compressed version exists
        target_path = Path(path)
        actual_path = None
        compression = None
        
        if target_path.exists() and not target_path.is_dir():
            actual_path = target_path
            if path.endswith('.br'):
                compression = 'br'
            elif path.endswith('.gz'):
                compression = 'gzip'
        elif target_path.with_suffix(target_path.suffix + '.br').exists():
            actual_path = target_path.with_suffix(target_path.suffix + '.br')
            compression = 'br'
        elif target_path.with_suffix(target_path.suffix + '.gz').exists():
            actual_path = target_path.with_suffix(target_path.suffix + '.gz')
            compression = 'gzip'
        
        if actual_path:
            # Determine MIME type
            ctype = self.guess_type(str(actual_path))
            
            # Special handling for Unity files
            if '.js' in path:
                ctype = 'application/javascript'
            elif '.wasm' in path:
                ctype = 'application/wasm'
            elif '.data' in path:
                ctype = 'application/octet-stream'
            
            try:
                f = open(actual_path, 'rb')
                fs = os.fstat(f.fileno())
                
                self.send_response(200)
                self.send_header('Content-Type', ctype)
                if compression:
                    self.send_header('Content-Encoding', compression)
                self.send_header('Content-Length', str(fs.st_size))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.end_headers()
                return f
            except Exception as e:
                if f: f.close()
                self.send_error(404, f"File not found: {e}")
                return None
        
        # For all other cases (including directories), use the default behavior
        return super().send_head()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom log format with compression info."""
        msg = format % args
        # Highlight compressed file requests
        if '.br' in msg:
            msg += ' [Brotli]'
        elif '.gz' in msg:
            msg += ' [Gzip]'
        print(f"[Server] {self.address_string()} - {msg}")

def main():
    """Start the server."""
    Handler = UnityWebGLHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print(f"Unity WebGL Server with Brotli Support")
        print("=" * 60)
        print(f"Server Address: http://localhost:{PORT}")
        print(f"Serving from:   {os.getcwd()}")
        print(f"\nFeatures:")
        print(f"  ✓ Brotli compression (.br) with Content-Encoding header")
        print(f"  ✓ Gzip compression (.gz) with Content-Encoding header")
        print(f"  ✓ CORS enabled for local development")
        print(f"  ✓ Proper MIME types for Unity files")
        print(f"\nPress Ctrl+C to stop the server")
        print("=" * 60)
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")

if __name__ == "__main__":
    main()
