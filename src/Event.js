import { div, hh } from "react-hyperscript-helpers";
import Radium from "radium";
import typography from "./styles";

const styles = {
  event: function (duration, positioning) {
    const horizontalPadding =
      positioning.width / 10 > 20 ? 20 : Math.floor(positioning.width / 10);
    const verticalPadding = duration / 5 > 20 ? 20 : Math.floor(duration / 5);

    return {
      boxSizing: "border-box",
      border: "1px solid white",
      backgroundColor: typography.color.component,
      backgroundSize: "100%",
      display: "inline-block",
      height: duration + "px",
      position: "absolute",
      top: positioning.top + "px",
      left: positioning.left + "px",
      width: positioning.width,
      padding: `${verticalPadding}px ${horizontalPadding}px ${verticalPadding}px ${horizontalPadding}px`,
      overflow: "hidden",
      borderBottomLeftRadius: "10px",
      borderTopLeftRadius: "10px",
      borderBottomRightRadius: "10px",
      borderTopRightRadius: "10px",
    };
  },
};

const fixAbsolutePadding = (element) => {
  return div({ style: { position: "relative" } }, [element]);
};

const Event = ({ event, positioning }) => {
  const duration = event?.end - event?.start;

  return fixAbsolutePadding(
    div(".event", { style: [styles.event(duration, positioning)] }, [
      div({ style: [typography.title, typography.brand] }, event?.title),
    ])
  );
};

export default hh(Radium(Event));
