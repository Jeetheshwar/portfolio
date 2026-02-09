import React, { useEffect } from 'react';

declare global {
  interface Window {
    UnicornStudio: any;
  }
}


interface UnicornEmbedProps {
  projectId: string;
  style?: React.CSSProperties;
  className?: string;
}

const UnicornEmbed: React.FC<UnicornEmbedProps> = ({ projectId, style, className }) => {
  useEffect(() => {
    // User Provided Script Logic adapted for React useEffect
    (function () {
      if (!window.UnicornStudio) {
        window.UnicornStudio = { isInitialized: false };

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.4/dist/unicornStudio.umd.js";
        script.onload = function () {
          // Check init flag, then init.
          if (!window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
          }
        };
        (document.head || document.body).appendChild(script);
      } else {
        // If already loaded, ensure init is called for the new component mount
        if (window.UnicornStudio.init) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      }
    })();
  }, []); // Note: multiple embeds might race on init, but the lib seems singleton-ish.

  return (
    <div
      data-us-project={projectId}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
        zIndex: 0,
        ...style // Allow overriding
      }}
    ></div>
  );
};

export default UnicornEmbed;
