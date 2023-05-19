type CommandBarItemType = "command" | "link";
interface CommandBarBaseItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  type: CommandBarItemType
}

export interface CommandBarSearchItem extends CommandBarBaseItem {
  type: "command";
  command: () => void;
}

export interface CommandBarLinkItem extends CommandBarBaseItem {
  type: "link";
  href: string;
}

export type CommandBarItem = CommandBarSearchItem | CommandBarLinkItem;
