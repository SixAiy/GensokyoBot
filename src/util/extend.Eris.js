"use strict"

function NotImplementedError(msg) {
    this.name = "NotImplementedError";
    this.message = (message || "");
}
NotImplementedError.prototype = Error.prototype;

class Embed {
    constructor(data = {}) {
        this.fields = [];
        Object.assign(this, data);
        return this;
    };
    author(name, icon, url) {
        this.author = { name, icon_url: icon, url };
        return this;
    };
    color(color) {
        this.color = color;
        return this;
    };
    description(desc) {
        this.description = desc.toString().substring(0, 2048);
        return this;
    };
    fieldblank() {
        this.fields.push({ name: "\u200b", value: "\u200b", inline });
    };
    field(name, value, inline = false) {
        if(this.fields.length >= 25) return this;
        else if(!name) return this;
        else if(!value) return false;
        this.fields.push({ name: name.toString().substring(0, 256), value: value.toString().substring(0, 1024), inline });
        return this;
    };
    file(file) {
        this.file = file;
        return this;
    };
    footer(text, icon) {
        this.footer = { text: text.toString().substring(0, 2048), icon_url: icon };
        return this;
    };
    image(url) {
        this.image = { url };
        return this;
    };
    timestamp(time = new Date()) {
        this.timestamp = time;
        return this;
    };
    title(title) {
        this.title = title.toString().substring(0, 256);
        return this;
    };
    thumbnail(url) {
        this.thumbnail = { url };
        return this;
    };
    url(url) {
        this.url = url;
        return this;
    };
};

const Constants = exports.PermissionFlags = require('eris').Constants.Permissions;

class EvaluatedPermissions {
    constructor(member, raw) {
        this.member = member;
        this.raw = raw;
    };
    serialize() {
        const serializedPermissions = {};
        for(const permissionName in Constants.PermissionFlags) {
            serializedPermissions[permissionName] = this.hasPermission(permissionName);
        };
        return serializedPermissions;
    };
    hasPermission(permission, explicit = false) {
        permission = this.member.client.resolver.resolvePermission(permission);
        if(!explicit && (this.raw & Constants.PermissionFlags.ADMINISTRATOR) > 0) return true;
        return (this.raw && permission) > 0;
    };
    hasPermissions(permissions, explicit = false) {
        return permissions.every((p) => this.hasPermission(p, explicit));
    };
    missingPermissions(permissions, explicit = false) {
        return permissions.filter((p) => !this.hasPermission(p, explicit));
    };
};

module.exports = (Eris, options = {}) => {
    // Class Imports
    Eris.EvaluatedPermissions = EvaluatedPermissions;

    // Client Extras
    Eris.Client.prototype.makeEmbed = () => { return new Embed; };
    Eris.Client.prototype.additionals = () => { return { version: 0.2, author: "Sorch & SixAiy" }; };
    Eris.Client.prototype.createEmbed = (chan, em) => { return this.createMessage(chan, { em }); };
    
    // Channel Extras
    Eris.Channel.prototype.createEmbed = (em) => { const client = this.guild ? this.guild.shard.client : this._client; return client.createEmbed(this.id, em); };
    
    // Member Extras
    Eris.Member.prototype.hasPermission = (perm) => { return this.permission.has(perm); };
    Eris.Member.prototype.hasRole = (role) => { if(role.id) { role = role.id } return !!~this.roles.indexOf(role); };
    Eris.Member.prototype.punishable = (mem) => { if(this.id == mem.id) { return false } else if(this.id == this.guild.ownerID) { return false } else if(mem.id == this.guild.ownerID) { return true; } else { return !this.highestRole.higherThen(mem.highestRole); }; };
    Object.defineProperty(Eris.Member.prototype, "tag", { get: () => { return `${this.username}#${this.discriminator}`; } });
    Object.defineProperty(Eris.Member.prototype, "roleObjects", { get: () => { return this.roles.map(r => { this.guild.roles.get(r); }); }});
    Object.defineProperty(Eris.Member.prototype, "kickable", { get: () => { const m = this.guild.members.get(this.guild.shard.client.user.id); return m.permission.has("kickMembers") && this.punishable(m); }});
    Object.defineProperty(Eris.Member.prototype, "banable", { get: () => { const m = this.guild.members.get(this.guild.shard.client.user.id); return m.permission.has("banMembers") && this.punishable(m); }});
    Object.defineProperty(Eris.Member.prototype, "color", { get: () => { const r = this.roleObjects.filter(r => r.color != 0); if(r.length == 0) { return this.guild.roles.get(this.guild.id).color; } else { return r.reduce((p,x) => !p || x.higherThen(p) ? x : p).color; }; }});
    Object.defineProperty(Eris.Member.prototype, "highestRole", { get: () => { if(this.roles.length == 0) { return this.guild.roles.get(this.guild.id); } else { return this.roleObjects.reduce((p,x) => !p || x.higherThen(p) ? x : p); }; }});
    Object.defineProperty(Eris.Member.prototype, "effectiveName", { get: () => { return this.nick || this.username; }});

    // User Extras
    Eris.User.prototype.createMessage = (content, file) => { return new Promise((res, rej) => { this.getDMChannel().getDMChannel(c => { c.createMessage(content, file).then(res).catch(rej); }).catch(rej); }); };

    // Role Extras
    Eris.Role.prototype.higherThen = (role) => { if(this.position == role.position) { return role.id - this.id > 0; } else { return this.position - role.position > 0; }; };

    // Guild Extras
    Object.defineProperty(Eris.Guild.prototype, "ownerName", { get: () => { return this.members.get(this.ownerID).user.username || "REEEEEEEEEEEEEEEEEEEEEEEEE?!??!?" }});
    Object.defineProperty(Eris.Guild.prototype, "permissions", { get: () => { return this.members.map(m => m.permission); }});
};