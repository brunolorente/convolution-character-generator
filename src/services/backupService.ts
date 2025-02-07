// src/services/backupService.ts
import { CharacterData, Backup } from '../types';

export class BackupService {
  private static instance: BackupService | null = null;
  private static readonly BACKUP_KEY_PREFIX = 'character_backup_';
  private static readonly DEFAULT_BACKUP_NAME = 'Autosave';

  static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  private constructor() {}

  saveBackup(data: CharacterData, name: string = BackupService.DEFAULT_BACKUP_NAME): void {
    const backup: Backup = {
      name: name || BackupService.DEFAULT_BACKUP_NAME,
      timestamp: new Date().toISOString(),
      data
    };
    const key = this.getBackupKey(name);
    localStorage.setItem(key, JSON.stringify(backup));
  }

  loadBackup(name: string = BackupService.DEFAULT_BACKUP_NAME): Backup | null {
    const key = this.getBackupKey(name);
    const backupJson = localStorage.getItem(key);
    if (backupJson) {
      try {
        return JSON.parse(backupJson);
      } catch (error) {
        console.error('Error loading backup:', error);
        return null;
      }
    }
    return null;
  }

  getAllBackups(): Backup[] {
    const backups: Backup[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(BackupService.BACKUP_KEY_PREFIX)) {
        try {
          const backup = JSON.parse(localStorage.getItem(key) || '');
          backups.push(backup);
        } catch (error) {
          console.error('Error loading backup:', error);
        }
      }
    }
    return backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  deleteBackup(name: string): void {
    const key = this.getBackupKey(name);
    localStorage.removeItem(key);
  }

  renameBackup(oldName: string, newName: string): void {
    if (newName && oldName !== newName) {
      const backup = this.loadBackup(oldName);
      if (backup) {
        this.deleteBackup(oldName);
        backup.name = newName;
        const key = this.getBackupKey(newName);
        localStorage.setItem(key, JSON.stringify(backup));
      }
    }
  }

  private getBackupKey(name: string): string {
    return BackupService.BACKUP_KEY_PREFIX + name.replace(/\s+/g, '_').toLowerCase();
  }
}