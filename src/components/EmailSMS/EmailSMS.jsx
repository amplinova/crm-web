// EmailSMS.jsx
import React, { useMemo, useState } from "react";
import {
  createEditor,
  Editor,
  Transforms,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";

// ✅ Initial content for the editor – MUST be an array
const INITIAL_VALUE = [
  {
    type: "paragraph",
    children: [
      {
        text: "This is editable rich text, much better than a <textarea>!",
      },
    ],
  },
];

export default function EmailSMS() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    cc: "",
    subject: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // ✅ Create Slate editor instance
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // ✅ Editor value state (ALWAYS an array)
  const [value, setValue] = useState(INITIAL_VALUE);

  const handleFieldChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);

    // Convert Slate nodes to plain text for sending
    const messageText = value.map((n) => Editor.string(editor, n)).join("\n");

    console.log({
      ...formData,
      message: messageText,
    });

    // Simulate API
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setFormData({
        from: "",
        to: "",
        cc: "",
        subject: "",
      });
      setValue([
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ]);
    }, 1000);
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Compose Email / SMS
      </h2>

      {sent && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700 font-medium">
          ✅ Message sent successfully!
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-4">
        {/* From */}
        <input
          type="email"
          name="from"
          placeholder="From"
          value={formData.from}
          onChange={handleFieldChange}
          required
          className="w-full px-4 py-2 border rounded"
        />

        {/* To */}
        <input
          type="email"
          name="to"
          placeholder="To"
          value={formData.to}
          onChange={handleFieldChange}
          required
          className="w-full px-4 py-2 border rounded"
        />

        {/* CC */}
        <input
          type="email"
          name="cc"
          placeholder="CC (optional)"
          value={formData.cc}
          onChange={handleFieldChange}
          className="w-full px-4 py-2 border rounded"
        />

        {/* Subject */}
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleFieldChange}
          required
          className="w-full px-4 py-2 border rounded"
        />

        {/* ✅ RICH TEXT EDITOR AREA */}
        <div className="border rounded">
          <Slate
            editor={editor}
            initialValue={value}              // 👈 this is NOW guaranteed to be an array
            onChange={(newValue) => setValue(newValue)}
          >
            <Toolbar />
            <div className="p-3 min-h-[150px] bg-white">
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Type your rich message..."
                className="outline-none"
              />
            </div>
          </Slate>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Toolbar & Buttons ---------- */

const Toolbar = () => {
  return (
    <div className="flex flex-wrap gap-2 border-b p-2 bg-gray-100">
      <MarkButton format="bold" label="B" />
      <MarkButton format="italic" label="I" />
      <MarkButton format="underline" label="U" />
      <MarkButton format="strikethrough" label="S" />
      <BlockButton format="block-quote" label="❝" />
      <BlockButton format="bulleted-list" label="•" />
      <BlockButton format="numbered-list" label="1." />
      <ImageButton />
    </div>
  );
};

const MarkButton = ({ format, label }) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
    >
      {label}
    </button>
  );
};

const BlockButton = ({ format, label }) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      className="px-2 py-1 text-sm border rounded hover:bg-gray-200"
    >
      {label}
    </button>
  );
};

const ImageButton = () => {
  const editor = useSlate();

  const insertImage = (editor, url) => {
    const image = { type: "image", url, children: [{ text: "" }] };
    Transforms.insertNodes(editor, image);
    Transforms.insertNodes(editor, {
      type: "paragraph",
      children: [{ text: "" }],
    });
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      insertImage(editor, reader.result);
    });

    reader.readAsDataURL(file);
  };

  return (
    <label className="px-2 py-1 text-sm border rounded cursor-pointer hover:bg-gray-200">
      🖼
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
};


/* ---------- Slate helper functions ---------- */

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ["bulleted-list", "numbered-list"].includes(n.type),
    split: true,
  });

  let newType = isActive ? "paragraph" : format;

  Transforms.setNodes(editor, { type: newType });

  if (!isActive && (format === "bulleted-list" || format === "numbered-list")) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
};

/* ---------- Renderers ---------- */

const renderElement = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          className="border-l-4 pl-4 ml-1 italic text-gray-600"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul className="list-disc pl-6" {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol className="list-decimal pl-6" {...attributes}>
          {children}
        </ol>
      );
    case "image":
      return (
        <div {...attributes} contentEditable={false} className="my-2">
          <img
            src={element.url}
            alt="Uploaded"
            className="max-w-full rounded shadow"
          />
          {children}
        </div>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const renderLeaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strikethrough) children = <s>{children}</s>;
  return <span {...attributes}>{children}</span>;
};
