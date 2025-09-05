#!/usr/bin/env node
// scripts/genKeys.js
const fs = 'fs'.promises;
const crypto = 'crypto';
const readline = 'readline/promises';
const path = 'path';

const __dirname = path.dirname(__filename);
const ENV_FILE = path.join(__dirname, '../.env');
const KEY_TYPES = {
  ENCRYPTION_KEY: { length: 32, description: 'AES-256 encryption key' },
  FIXED_IV_EMAIL: { length: 16, description: 'Fixed IV for email encryption' },
  FIXED_IV_PHONE: { length: 16, description: 'Fixed IV for phone encryption' },
  HASH_PEPPER: { length: 32, description: 'Pepper for hash functions' }
};

class KeyManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async init() {
    try {
      await this.ensureEnvFile();
      const currentConfig = await this.loadConfig();

      for (const [key, config] of Object.entries(KEY_TYPES)) {
        await this.handleKey(key, config, currentConfig[key]);
      }

      console.log('\n🔐 All keys validated and updated');
    } catch (error) {
      console.error('❌ Key management failed:', error);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  async ensureEnvFile() {
    try {
      await fs.access(ENV_FILE);
    } catch {
      await fs.writeFile(ENV_FILE, '', { mode: 0o600 });
    }
  }

  async loadConfig() {
    const content = await fs.readFile(ENV_FILE, 'utf8').catch(() => '');
    const config = {};

    content.split('\n').forEach(line => {
      const [key, value] = line.split('=').map(s => s.trim());
      if (key in KEY_TYPES) config[key] = value;
    });

    return config;
  }

  async handleKey(key, config, currentValue) {
    console.log(`\n=== ${key} (${config.description}) ===`);

    const isValid = currentValue
      ? await this.validateKey(key, currentValue, config.length)
      : false;

    if (isValid) {
      console.log(`✓ Current ${key} is valid`);
      return;
    }

    if (currentValue) {
      console.log(`⚠️ Current ${key} is invalid or malformed`);
    } else {
      console.log(`⚠️ ${key} not found in configuration`);
    }

    const answer = await this.rl.question(`Generate new ${key}? (y/N) `);
    if (answer.toLowerCase() !== 'y') {
      console.log(`✗ Skipping ${key} generation`);
      return;
    }

    const newValue = this.generateKey(config.length);
    await this.updateConfig(key, newValue);
    console.log(`✓ Generated new ${key}`);
  }

  async validateKey(key, value, expectedLength) {
    if (!this.isValidHex(value, expectedLength)) return false;

    if (key === 'ENCRYPTION_KEY') {
      return await this.testAESKey(value);
    }

    return true;
  }

  isValidHex(value, expectedBytes) {
    return /^[0-9a-f]+$/i.test(value) && value.length === expectedBytes * 2;
  }

  async testAESKey(key) {
    try {
      const iv = crypto.randomBytes(16);
      const testData = crypto.randomBytes(32);

      const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
      const encrypted = Buffer.concat([
        cipher.update(testData),
        cipher.final(),
        cipher.getAuthTag()
      ]);

      const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
      decipher.setAuthTag(encrypted.subarray(-16));
      const decrypted = Buffer.concat([
        decipher.update(encrypted.subarray(0, -16)),
        decipher.final()
      ]);

      return decrypted.equals(testData);
    } catch {
      return false;
    }
  }

  generateKey(bytes) {
    return crypto.randomBytes(bytes).toString('hex');
  }

  async updateConfig(key, value) {
    const content = await fs.readFile(ENV_FILE, 'utf8').catch(() => '');
    const lines = content.split('\n').filter(Boolean);
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(`${key}=`)) {
        lines[i] = `${key}=${value}`;
        updated = true;
        break;
      }
    }

    if (!updated) {
      lines.push(`${key}=${value}`);
    }

    await fs.writeFile(ENV_FILE, lines.join('\n') + '\n', { mode: 0o600 });
  }
}

// Run the key manager
new KeyManager().init().catch(console.error);
