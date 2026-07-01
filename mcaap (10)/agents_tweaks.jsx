// agents_tweaks.jsx — Tweaks panel for the agent-integration prototype

const AGENT_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "framing": "codename",
  "glyph": "diamond",
  "flat": false,
  "convergence": "separate"
}/*EDITMODE-END*/;

function AgentTweaks({ t, setTweak }){
  return (
    <TweaksPanel>
      <TweakSection label="Agent model — how agents are framed"/>
      <TweakSelect label="Framing" value={t.framing}
        options={[
          {value:'codename', label:'Codename + role  (CASSIUS · Privilege)'},
          {value:'role',     label:'Role only  (Privilege Sentinel)'},
          {value:'named',    label:'Named teammate  (CASSIUS)'},
          {value:'task',     label:'Task-attached  (an agent = a way to do work)'},
        ]}
        onChange={(v)=>setTweak('framing', v)}/>

      <TweakSection label="Agent glyph"/>
      <TweakRadio label="Token shape" value={t.glyph}
        options={['diamond','square','mono']}
        onChange={(v)=>setTweak('glyph', v)}/>
      <TweakToggle label="Filled tokens" value={t.flat}
        onChange={(v)=>setTweak('flat', v)}/>
    </TweaksPanel>
  );
}

Object.assign(window, { AGENT_TWEAK_DEFAULTS, AgentTweaks });
