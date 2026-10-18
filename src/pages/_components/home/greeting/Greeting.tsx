type Props = {
  name: string;
};

export default function Greeting({ name }: Props) {
  return <h1 className="text-3xl font-bold">Hello, {name}!</h1>;
}
