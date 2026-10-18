"use client";

import { Button, Description, Dropdown, Kbd, Label } from "@heroui/react";
import { FloppyDiskIcon, FolderOpenIcon, ListIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";

const popoverClassName = "menu-dropdown__popover border border-white/15 bg-white/5 backdrop-blur-md";
const menuClassName = "menu-dropdown__menu";

export function MenuDropdown() {
  return (
    <Dropdown>
      <Button aria-label="Menu" variant="ghost" className="bg-white/5 border border-white/15 backdrop-blur-md hover:bg-white/25 transition-colors duration-150" isIconOnly>
        <ListIcon/>
      </Button>
      <Dropdown.Popover isNonModal className={popoverClassName}>
        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)} className={menuClassName}>
          <Dropdown.SubmenuTrigger>
            <Dropdown.Item id="current-projects" textValue="Current Projects">
              <div className="flex h-8 items-start justify-center pt-px">
                <FolderOpenIcon className="size-4 shrink-0 text-accent" weight="bold" />
              </div>
              <div className="flex flex-col">
                <Label className="font-sans">Current projects</Label>
                <Description>My current day-to-day</Description>
              </div>
              <Dropdown.SubmenuIndicator />
            </Dropdown.Item>
            <Dropdown.Popover isNonModal className={popoverClassName}>
              <Dropdown.Menu className={menuClassName}>
                <Dropdown.Item id="whatsapp" textValue="WhatsApp">
                  <Label>WhatsApp</Label>
                </Dropdown.Item>
                <Dropdown.Item id="telegram" textValue="Telegram">
                  <Label>Telegram</Label>
                </Dropdown.Item>
                <Dropdown.Item id="discord" textValue="Discord">
                  <Label>Discord</Label>
                </Dropdown.Item>
                <Dropdown.SubmenuTrigger>
                  <Dropdown.Item id="email" textValue="Email">
                    <Label>Email</Label>
                    <Dropdown.SubmenuIndicator />
                  </Dropdown.Item>
                  <Dropdown.Popover isNonModal className={popoverClassName}>
                    <Dropdown.Menu className={menuClassName}>
                      <Dropdown.Item id="work" textValue="Work email">
                        <Label>Work email</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="personal" textValue="Personal email">
                        <Label>Personal email</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown.SubmenuTrigger>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>
          <Dropdown.SubmenuTrigger>
            <Dropdown.Item id="past-projects" textValue="Past Projects">
              <div className="flex h-8 items-start justify-center pt-px">
                <FloppyDiskIcon className="size-4 shrink-0 text-accent" weight="bold" />
              </div>
              <div className="flex flex-col">
                <Label className="font-sans">Past projects</Label>
                <Description>What got me here</Description>
              </div>
              <Dropdown.SubmenuIndicator />
            </Dropdown.Item>
            <Dropdown.Popover isNonModal className={popoverClassName}>
              <Dropdown.Menu className={menuClassName}>
                <Dropdown.Item id="whatsapp" textValue="WhatsApp">
                  <Label>WhatsApp</Label>
                </Dropdown.Item>
                <Dropdown.Item id="telegram" textValue="Telegram">
                  <Label>Telegram</Label>
                </Dropdown.Item>
                <Dropdown.Item id="discord" textValue="Discord">
                  <Label>Discord</Label>
                </Dropdown.Item>
                <Dropdown.SubmenuTrigger>
                  <Dropdown.Item id="email" textValue="Email">
                    <Label>Email</Label>
                    <Dropdown.SubmenuIndicator />
                  </Dropdown.Item>
                  <Dropdown.Popover isNonModal className={popoverClassName}>
                    <Dropdown.Menu className={menuClassName}>
                      <Dropdown.Item id="work" textValue="Work email">
                        <Label>Work email</Label>
                      </Dropdown.Item>
                      <Dropdown.Item id="personal" textValue="Personal email">
                        <Label>Personal email</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown.SubmenuTrigger>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
