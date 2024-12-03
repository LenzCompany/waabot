
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class ApplicationMonitor {
    constructor(options = {}) {
        this.appPath = options.appPath || './main.js';
        this.maxRestarts = options.maxRestarts || 999;
        this.restartInterval = options.restartInterval || 5000;
        this.restartCount = 0;
    }

    // Metode logging
    log(message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
        
        // Optional: Simpan log ke file
        fs.appendFileSync('app-monitor.log', `${timestamp} - ${message}\n`, 'utf8');
    }

    // Mulai aplikasi
    start() {
        // Cek batasan restart
        if (this.restartCount >= this.maxRestarts) {
            this.log('Maksimal restart tercapai. Berhenti.');
            process.exit(1);
        }

        this.log(`Memulai aplikasi (Restart ke-${this.restartCount + 1})`);

        // Spawn proses baru
        const app = spawn('node', [this.appPath], {
            stdio: 'inherit',
            shell: false
        });

        // Event handler
        app.on('spawn', () => {
            this.log('Aplikasi berhasil dimulai');
        });

        app.on('exit', (code, signal) => {
            this.log(`Aplikasi berhenti. Kode: ${code}, Signal: ${signal}`);
            
            // Restart otomatis dengan jeda
            setTimeout(() => {
                this.start();
            }, this.restartInterval);
        });

        app.on('error', (err) => {
            this.log(`Error menjalankan aplikasi: ${err.message}`);
            
            // Restart otomatis dengan jeda
            setTimeout(() => {
                this.start();
            }, this.restartInterval);
        });
    }
}

// Inisialisasi monitor
const monitor = new ApplicationMonitor({
    appPath: './main.js',
    maxRestarts: 999,
    restartInterval: 5000
});

// Mulai monitoring
monitor.start();

// Tangani error global
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
