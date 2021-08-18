/*
#####################################################################
# File: extendEris.js
# Title: A Radio Music Bot
# Author: SixAiy <me@sixaiy.com>
# Version: 0.5a
# Description:
#  A GensokyoRadio.net Discord bot for playing the radio on discord.
#####################################################################

#####################################################################
# License
#####################################################################
# Copyright 2021 Contributing Authors
# This program is distributed under the terms of the GNU GPL.
######################################################################
*/

function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = (message || "");
};
NotImplementedError.prototype = Error.prototype;
class Embed {
      constructor(data = {}) {
          this.fields = [];
          Object.assign(this, data);
          return this;
      }
      author(name, icon, url) {
          this.author = { name, icon_url: icon, url };
  
          return this;
      }
      color(color) {
          this.color = color;
  
          return this;
      }
      description(desc) {
          this.description = desc.toString().substring(0, 2048);
  
          return this;
      }
      blankfield(name, value, inline = false) {
          this.fields.push({ name: "\u200b", value: "\u200b", inline});
      }
      field(name, value, inline = false) {
          if(this.fields.length >= 25) return this;
          else if(!name) return this;
          else if(!value) return false;
          this.fields.push({ name: name.toString().substring(0, 256), value: value.toString().substring(0, 1024), inline });
  
          return this;
      }
      file(file) {
          this.file = file;
  
          return this;
      }
      footer(text, icon) {
          this.footer = { text: text.toString().substring(0, 2048), icon_url: icon };
  
          return this;
      }
      image(url) {
          this.image = { url };
  
          return this;
      }
      timestamp(time = new Date()) {
          this.timestamp = time;
          return this;
      }
      title(title) {
          this.title = title.toString().substring(0, 256);
          return this;
      }
  
      thumbnail(url) {
          this.thumbnail = { url };
          return this;
      }
      url(url) {
          this.url = url;
          return this;
      }
};
const Constants = exports.PermissionFlags = require("eris").Constants.Permissions;
class EvaluatedPermissions {
    constructor(member, raw) {
      /**
       * The member this permissions refer to
       * @type {GuildMember}
       */
      this.member = member;
  
      /**
       * A number representing the packed permissions
       * @type {number}
       */
      this.raw = raw;
    }
  
    /**
     * Get an object mapping permission name, e.g. `READ_MESSAGES` to a boolean - whether the user
     * can perform this or not.
     * @returns {Object<string, boolean>}
     */
    serialize() {
      const serializedPermissions = {};
      for (const permissionName in Constants.PermissionFlags) {
        serializedPermissions[permissionName] = this.hasPermission(permissionName);
      }
      return serializedPermissions;
    }
  
    /**
     * Checks whether the user has a certain permission, e.g. `READ_MESSAGES`.
     * @param {PermissionResolvable} permission The permission to check for
     * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permission
     * @returns {boolean}
     */
    hasPermission(permission, explicit = false) {
      permission = this.member.client.resolver.resolvePermission(permission);
      if (!explicit && (this.raw & Constants.PermissionFlags.ADMINISTRATOR) > 0) return true;
      return (this.raw & permission) > 0;
    }
  
    /**
     * Checks whether the user has all specified permissions.
     * @param {PermissionResolvable[]} permissions The permissions to check for
     * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permissions
     * @returns {boolean}
     */
    hasPermissions(permissions, explicit = false) {
      return permissions.every(p => this.hasPermission(p, explicit));
    }
  
    /**
     * Checks whether the user has all specified permissions, and lists any missing permissions.
     * @param {PermissionResolvable[]} permissions The permissions to check for
     * @param {boolean} [explicit=false] Whether to require the user to explicitly have the exact permissions
     * @returns {PermissionResolvable[]}
     */
    missingPermissions(permissions, explicit = false) {
      return permissions.filter(p => !this.hasPermission(p, explicit));
    }
};

module.exports = (Eris, options = {}) => {
      Eris.EvaluatedPermissions =  EvaluatedPermissions;
      
      Eris.Client.prototype.makeEmbed = function() {
          return new Embed;
      };
      Eris.Client.prototype.additionals = function() {
          return {version: 0.1, author: "Sorch"};
      };
      Eris.Client.prototype.createEmbed = function(channelID, embed) {
          return this.createMessage(channelID, { embed });
      };
      Eris.Client.prototype.getAllTextChannelsAsCount = function() {
          let n = 0;
          this.guilds.map(m => {
              m.channels.map(ch => {
                  if(ch.type == 0) {
                      n++;
                  }
              })
          })
          return n;
      }
      Eris.Client.prototype.getAllVoiceChannelsAsCount = function() {
          let n = 0;
          this.guilds.map(m => {
              m.channels.map(ch => {
                  if(ch.type == 2) {
                      n++;
                  }
              })
          })
          return n;
      }
      Eris.Channel.prototype.createEmbed = function(embed) {
          const client = this.guild ? this.guild.shard.client : this._client;
          return client.createEmbed(this.id, embed);
      };
      Eris.Client.prototype.setStatus = function(status, ty, url) {
          url = url || null;
          const statuses = {"playing": 0, "twitch": 1, "listening": 2, "watching": 3, "custom": 4};
          if(statuses.hasOwnProperty(ty)) {
              const statusid = statuses[ty];
              if(statusid == 4) {
                  throw new NotImplementedError("Not a function");
              }
              if(statusid == 1 && url) {
                  return this.editStatus("online", { name: status, type: statusid, url: url});
              } else {
                  return this.editStatus("online", { name: status, type: statusid});
              }
          } else {
              throw Error("Statuses are only playing twitch watching listening and custom");
          }
      }
      Eris.Client.prototype.findVoiceChannel = function(name) {
          let channelname;
          this.guilds.map(g => {
              g.channels.map(ch => {
                   if (ch.type == 2 && ch.id == name) {
                       channelname = ch;
                   }
              })
          })
          return channelname;
      }
      Eris.Member.prototype.hasPermission = function(perm) {
          return this.permissions.has(perm);
      };
      Eris.Client.prototype.createCode = function(channelID, code, lang = "") {
          return this.createMessage(channelID, `\`\`\`${lang}\n${code}\n\`\`\``);
      };
      Eris.Channel.prototype.createCode = function(code, lang) {
          const client = this.guild ? this.guild.shard.client : this._client;
          return client.createCode(this.id, code, lang);
      };
      Eris.Member.prototype.hasRole = function(roleID) {
          if(roleID.id) roleID = roleID.id;
          return !!~this.roles.indexOf(roleID);
      };
      Eris.User.prototype.createMessage = function(content, file) {
          return new Promise((resolve, reject) => {
              this.getDMChannel().then(channel => {
                  channel.createMessage(content, file).then(resolve).catch(reject);
              }).catch(reject);
          });
      }
      Object.defineProperty(Eris.Member.prototype, "tag", {
          get: function() {
              return `${this.username}#${this.discriminator}`;
          }
      });
      Eris.Role.prototype.higherThan = function(role) {
          if(this.position === role.position) return role.id - this.id > 0;
          else return this.position - role.position > 0;
      };
      Object.defineProperty(Eris.Member.prototype, "roleObjects", {
          get: function() {
              return this.roles.map(roleID => this.guild.roles.get(roleID));
          }
      });
      Eris.Member.prototype.punishable = function(member2) {
          if(this.id === member2.id) return false;
          else if(this.id === this.guild.ownerID) return false;
          else if(member2.id === this.guild.ownerID) return true;
          else return !this.highestRole.higherThan(member2.highestRole);
      };
      Object.defineProperty(Eris.Member.prototype, "kickable", {
          get: function() {
              const clientMember = this.guild.members.get(this.guild.shard.client.user.id);
              return clientMember.permission.has("kickMembers") && this.punishable(clientMember);
          }
      });
      Object.defineProperty(Eris.Member.prototype, "bannable", {
          get: function() {
              const clientMember = this.guild.members.get(this.guild.shard.client.user.id);
              return clientMember.permission.has("banMembers") && this.punishable(clientMember);
          }
      });
      Object.defineProperty(Eris.Member.prototype, "color", {
          get: function() {
              const roles = this.roleObjects.filter(r => r.color !== 0);
              if(roles.length == 0) return this.guild.roles.get(this.guild.id).color;
              else return roles.reduce((prev, role) => !prev || role.higherThan(prev) ? role : prev).color;
          }
      });
      Object.defineProperty(Eris.Member.prototype, "highestRole", {
          get: function() {
              if(this.roles.length === 0) return this.guild.roles.get(this.guild.id);
              else return this.roleObjects.reduce((prev, role) => !prev || role.higherThan(prev) ? role : prev);
          }
      });
      
      Object.defineProperty(Eris.Member.prototype, 'effectiveName', {
          get: function() {
              return this.nick || this.username;
          }
      });
      Object.defineProperty(Eris.Guild.prototype, "ownerName", {
          get: function() {
              //FUCK WHY CAN'T ERIS HAVE THIS ALREADY
              return this.members.get(this.ownerID).user.username || "REEEEEEEEEEEEEEEEEEEEEEEEE";
          }
      });
      Object.defineProperty(Eris.Guild.prototype, "permissions", {
          get: function() {
              return this.members.map(member => member.permission);
          }
      });
      
};