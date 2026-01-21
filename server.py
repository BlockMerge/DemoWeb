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
        """Override to set correct Content-Type before sending headers."""
        path = self.translate_path(self.path)
        
        # Handle Brotli compressed files
        if self.path.endswith('.br'):
            # Determine the original file type
            if '.js.br' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/javascript')
                self.send_header('Content-Encoding', 'br')
            elif '.wasm.br' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/wasm')
                self.send_header('Content-Encoding', 'br')
            elif '.data.br' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/octet-stream')
                self.send_header('Content-Encoding', 'br')
            else:
                return super().send_head()
            
            # Enable CORS
            self.send_header('Access-Control-Allow-Origin', '*')
            
            # Get file size
            try:
                f = open(path, 'rb')
                fs = os.fstat(f.fileno())
                self.send_header('Content-Length', str(fs.st_size))
                self.end_headers()
                return f
            except:
                self.send_error(404, "File not found")
                return None
        
        # Handle Gzip compressed files
        elif self.path.endswith('.gz'):
            if '.js.gz' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/javascript')
                self.send_header('Content-Encoding', 'gzip')
            elif '.wasm.gz' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/wasm')
                self.send_header('Content-Encoding', 'gzip')
            elif '.data.gz' in self.path:
                self.send_response(200)
                self.send_header('Content-Type', 'application/octet-stream')
                self.send_header('Content-Encoding', 'gzip')
            else:
                return super().send_head()
            
            # Enable CORS
            self.send_header('Access-Control-Allow-Origin', '*')
            
            # Get file size
            try:
                f = open(path, 'rb')
                fs = os.fstat(f.fileno())
                self.send_header('Content-Length', str(fs.st_size))
                self.end_headers()
                return f
            except:
                self.send_error(404, "File not found")
                return None
        
        # For all other files, use the default behavior
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
