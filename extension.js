/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from 'gi://GObject';
import Gdk from 'gi://Gdk';
import St from 'gi://St';

import {
    Extension
} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init() {
            super._init(0.0, 'Strings Indicator');

            this.add_child(new St.Icon({
                icon_name: 'edit-copy-symbolic',
                style_class: 'system-status-icon',
            }));

            // Lorem Ipsum text
            this.lipsummenu = new PopupMenu.PopupMenuItem('Lorem Ipsum');
            this.lipsummenu.connect('activate', () => {
                let sentence =
                    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua velit egestas dui id ornare arcu odio ut sem nulla lorem sed risus ultricies tristique nulla aliquet enim tortor at nibh sed pulvinar proin gravida hendrerit lectus a risus sed vulputate odio ut enim cursus euismod quis viverra nibh cras pulvinar quis enim lobortis scelerisque fermentum dui faucibus in ornare dictumst vestibulum rhoncus est pellentesque elit blandit cursus risus at ultrices mi tempus nulla pharetra diam sit amet nisl suscipit adipiscing";
                let words = sentence.split(" ");
                let x, i, j;
                for (i = words.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = words[i];
                    words[i] = words[j];
                    words[j] = x;
                }
                words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                sentence = words.slice(0, 10).join(" ") + ".";

                this.copyString(sentence);
            });
            this.menu.addMenuItem(this.lipsummenu);

            // Date
            this.datemenu = new PopupMenu.PopupMenuItem('Date as YYYY-MM-DD');
            this.datemenu.connect('activate', () => {
                const now = new Date();
                const offset = now.getTimezoneOffset();
                const offsetDate = new Date(now.getTime() - (offset * 60 * 1000));
                const dateyyyymmdd = offsetDate.toISOString().split('T')[0];

                this.copyString(dateyyyymmdd);
            });
            this.menu.addMenuItem(this.datemenu);

            // Epoch
            this.epochmenu = new PopupMenu.PopupMenuItem('Epoch');
            this.epochmenu.connect('activate', () => {
                const epoch = new Date().getTime();
                this.copyString(epoch.toString());
            });
            this.menu.addMenuItem(this.epochmenu);

            // Hash
            this.hashmenu = new PopupMenu.PopupMenuItem('Random Hash');
            this.hashmenu.connect('activate', () => {
                let hash = "",
                    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (let i = 0; i < 7; i++)
                    hash += chars.charAt(Math.floor(Math.random() * chars.length));
                this.copyString(hash);
            });
            this.menu.addMenuItem(this.hashmenu);

        }

        copyString(text) {
            // St.Clipboard.get_default().set_text(St.ClipboardType.CLIPBOARD, text);
            let clipboard = St.Clipboard.get_default();
            clipboard.set_text(St.ClipboardType.CLIPBOARD, text);
            Main.notify(`Copied "${text}" to the clipboard.`);
        }
    });

export default class StringsExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
