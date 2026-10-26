import { FolderIcon, FileTextIcon } from "@phosphor-icons/react";
import { ColumnBrowser, Link, Text, VStack } from "@/ohmygui";

export default function Example() {
  return <VStack gap="md" align="stretch">
    <Link href="/ohmygui/examples/column-browser" data-astro-reload>Open fullscreen explorer ↗</Link>
    <ColumnBrowser aria-label="Projects" defaultPath={["studio", "website"]} style={{ height: 380 }} defaultColumnWidth={200}>
      <ColumnBrowser.Item id="studio" label="Studio" startContent={<FolderIcon />}>
        <ColumnBrowser.Item id="website" label="Website" startContent={<FolderIcon />}>
          <ColumnBrowser.Item id="brief" label="Brief.md" startContent={<FileTextIcon />}>
            <ColumnBrowser.Item.Detail><VStack gap="md"><Text as="h3" variant="title">A clearer direction.</Text><Text>Build a quiet workspace for good ideas.</Text></VStack></ColumnBrowser.Item.Detail>
          </ColumnBrowser.Item>
        </ColumnBrowser.Item>
        <ColumnBrowser.Item id="archive" label="Archive" branch />
      </ColumnBrowser.Item>
      <ColumnBrowser.Item id="notes" label="Notes.md" startContent={<FileTextIcon />}>
        <ColumnBrowser.Item.Detail><Text>Every branch keeps its place in the path.</Text></ColumnBrowser.Item.Detail>
      </ColumnBrowser.Item>
    </ColumnBrowser>
  </VStack>;
}
