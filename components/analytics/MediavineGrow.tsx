// Mediavine Grow init. Server-rendered as a plain <script> tag so the
// snippet appears verbatim in the SSR HTML — Mediavine's verifier scrapes
// the static response and looks for the data-grow-initializer attribute,
// which Next's <Script> wrapper would otherwise rewrite.
export function MediavineGrow({ siteId }: { siteId: string }) {
  const inline = `!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id",${JSON.stringify(siteId)});var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`;
  return (
    <script
      data-grow-initializer=""
      dangerouslySetInnerHTML={{ __html: inline }}
    />
  );
}
