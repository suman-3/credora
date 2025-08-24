interface SheetItemProps {
  children?: React.ReactNode;
  strong: string;
  text: string;
}
const SheetItem = ({ children, strong, text }: SheetItemProps) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <strong className="">{strong} :</strong>
      <p>{text}</p>
    </div>
  );
};

export default SheetItem;
