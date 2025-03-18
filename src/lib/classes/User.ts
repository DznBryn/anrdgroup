import bcrypt from 'bcryptjs';

export class User {
    private id: number | string;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        private password: string
    ) {
        this.id = 0;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName; 
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    set setId(id: number | string) {
        this.id = id;
    }

    get getId() {
        return this.id;
    }

    set setCreatedAt(createdAt: Date) {
        this.createdAt = createdAt;
    }

    get getCreatedAt() {
        return this.createdAt;
    }

    set setUpdatedAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }

    get getUpdatedAt() {
        return this.updatedAt;
    }

    set setPassword(password: string) {
        this.hashPassword(password).then((hashedPassword) => {
            return this.password = hashedPassword;
        });
    }

    get getPassword() {
        console.log('Password hashed:', this.password);
        return this.password;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    getInitials() {
        return `${this.firstName.charAt(0).toUpperCase()}${this.lastName.charAt(0).toUpperCase()}`;
    }

    async hashPassword(password: string, salt: number = 10): Promise<string> {
        if (!password) {
            throw new Error('No password provided');
        }

        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        return this.password = hashedPassword;
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        if (!password || !hashedPassword) {
            throw new Error('Password or hashed password not provided');
        }

        const verified = await bcrypt.compare(password, hashedPassword);
        return verified;
    }

    async save() {
        // Save user to database
        await this.hashPassword(this.password)
    }
}
