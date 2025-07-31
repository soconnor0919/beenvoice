"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface EmailComposerProps {
  subject: string;
  onSubjectChange: (subject: string) => void;
  content?: string;
  onContentChange?: (content: string) => void;
  customMessage?: string;
  onCustomMessageChange?: (customMessage: string) => void;
  fromEmail: string;
  toEmail: string;
  ccEmail?: string;
  onCcEmailChange?: (ccEmail: string) => void;
  bccEmail?: string;
  onBccEmailChange?: (bccEmail: string) => void;
  className?: string;
}

const MenuButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <Button
    type="button"
    variant={isActive ? "default" : "ghost"}
    size="sm"
    onClick={onClick}
    title={title}
    className="h-8 w-8 p-0"
  >
    {children}
  </Button>
);

export function EmailComposer({
  subject,
  onSubjectChange,
  content: _content,
  onContentChange: _onContentChange,
  customMessage = "",
  onCustomMessageChange,
  fromEmail,
  toEmail,
  ccEmail = "",
  onCcEmailChange,
  bccEmail = "",
  onBccEmailChange,
  className,
}: EmailComposerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: customMessage,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onCustomMessageChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-4 border  bg-background",
      },
    },
  });

  // Update editor content when customMessage prop changes
  useEffect(() => {
    if (editor && customMessage !== undefined) {
      const currentContent = editor.getHTML();
      if (currentContent !== customMessage) {
        editor.commands.setContent(customMessage);
      }
    }
  }, [editor, customMessage]);

  const colors = [
    "#000000",
    "#374151",
    "#DC2626",
    "#EA580C",
    "#D97706",
    "#65A30D",
    "#16A34A",
    "#0891B2",
    "#2563EB",
    "#7C3AED",
    "#C026D3",
    "#DC2626",
  ];

  if (!editor) {
    return (
      <div className="bg-muted flex h-[200px] items-center justify-center  border">
        <div className="text-center">
          <div className="border-primary mx-auto mb-2 h-4 w-4 animate-spin  border-2 border-t-transparent"></div>
          <p className="text-muted-foreground text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Email Headers */}
      <div className="bg-muted/20 space-y-4  border p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from-email" className="text-sm font-medium">
              From
            </Label>
            <Input
              id="from-email"
              value={fromEmail}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to-email" className="text-sm font-medium">
              To
            </Label>
            <Input
              id="to-email"
              value={toEmail}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>
        </div>
        {(onCcEmailChange ?? onBccEmailChange) && (
          <div className="grid grid-cols-2 gap-4">
            {onCcEmailChange && (
              <div className="space-y-2">
                <Label htmlFor="cc-email" className="text-sm font-medium">
                  CC
                </Label>
                <Input
                  id="cc-email"
                  value={ccEmail ?? ""}
                  onChange={(e) => onCcEmailChange(e.target.value)}
                  placeholder="CC email addresses..."
                  className="bg-background"
                />
              </div>
            )}
            {onBccEmailChange && (
              <div className="space-y-2">
                <Label htmlFor="bcc-email" className="text-sm font-medium">
                  BCC
                </Label>
                <Input
                  id="bcc-email"
                  value={bccEmail}
                  onChange={(e) => onBccEmailChange(e.target.value)}
                  placeholder="BCC email addresses..."
                  className="bg-background"
                />
              </div>
            )}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject
          </Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            placeholder="Enter email subject..."
            className="bg-background"
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Custom Message Field with Rich Text Editor */}
      {onCustomMessageChange && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Custom Message (Optional)
            </Label>
            <p className="text-muted-foreground mb-2 text-xs">
              This message will appear between the greeting and invoice summary
            </p>
          </div>

          {/* Editor Toolbar */}
          <div className="bg-muted/20 flex flex-wrap items-center gap-1  border p-2">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Underline className="h-4 w-4" />
            </MenuButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </MenuButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </MenuButton>

            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Ordered List"
            >
              <ListOrdered className="h-4 w-4" />
            </MenuButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Text Color"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="grid grid-cols-6 gap-1">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-6 w-6 rounded border border-gray-300 hover:scale-110"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Rich Text Editor */}
          <div>
            <EditorContent editor={editor} />
          </div>
        </div>
      )}
    </div>
  );
}
