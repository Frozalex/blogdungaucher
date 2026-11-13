/** Aggregate events only: no email address, draft, annotation or reading history. */
export function trackEngagement(name:string,data:Record<string,string|number|boolean>={}){
 const browser=window as Window&{umami?:{track:(name:string,data:Record<string,string|number|boolean>)=>void}};
 if(navigator.doNotTrack==='1'||(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl)return;
 try{browser.umami?.track(name,data);}catch{}
}
