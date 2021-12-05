interface Props {
  children: JSX.Element;
  tab: number;
  index: number;
}

// TabPanel component to create swiping effect with SwipeableViews
export default function TabPanel({ children, tab, index }: Props) {
  return (
    <div role="tabpanel" hidden={tab !== index} id={`simple-tabpanel-${index}`}>
      {tab === index && <>{children}</>}
    </div>
  );
}
