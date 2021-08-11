// Models
import { TabPanelState } from '../../models/stateResource';

// TabPanel component to create swiping effect with SwipeableViews
export default function TabPanel({ children, tab, index }: TabPanelState) {
  return (
    <div role="tabpanel" hidden={tab !== index} id={`simple-tabpanel-${index}`}>
      {tab === index && <>{children}</>}
    </div>
  );
}
