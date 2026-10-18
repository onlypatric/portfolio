import { SearchField } from "@/_components/common/ohmygui/input/SearchField";

export default function Example() {
  return (
    <SearchField label="Search components" name="query" placeholder="Try Badge…" suggestions={["Badge", "Button", "Banner"]} />
  );
}
