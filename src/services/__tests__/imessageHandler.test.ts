import initSqlJs from 'sql.js';
import handleImessageDBFiles from '@services/parsing/imessage/imessageHandler';
import {describe, expect, it} from '@jest/globals';

async function createMockFile(): Promise<File> {
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    // Create tables and insert test data
    db.run(`
        CREATE TABLE handle (rowid INTEGER PRIMARY KEY, id TEXT);
        CREATE TABLE message (rowid INTEGER PRIMARY KEY, text TEXT, date INTEGER, handle_id INTEGER);
        CREATE TABLE chat (rowid INTEGER PRIMARY KEY, chat_identifier TEXT);
        CREATE TABLE chat_message_join (chat_id INTEGER, message_id INTEGER);
    `);

    db.run(`
        INSERT INTO handle (id) VALUES ('+1234567890');
        INSERT INTO message (text, date, handle_id) VALUES ('Hello world', 1620000000000000, 1);
        INSERT INTO chat (chat_identifier) VALUES ('chat1');
        INSERT INTO chat_message_join (chat_id, message_id) VALUES (1, 1);
    `);

    // Convert the database to a Uint8Array
    const data = db.export();
    const buffer = new Uint8Array(data);

    // Create a mock File object
    const file = new File([buffer], 'test.sqlite', { type: 'application/x-sqlite3' });

    db.close();
    return file;
}

describe('handleImessageDBFiles', () => {
    it('should process the mock iMessage DB file correctly', async () => {
        const mockFile = await createMockFile();
        const result = await handleImessageDBFiles(mockFile);
        console.log(result);
        // Add your assertions here based on the expected result
        expect(result).toBeDefined();
    });
});