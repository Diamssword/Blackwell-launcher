class ProfilePicker {
    constructor(DOM,profiles) {
        this.profiles = profiles
        this.dom = DOM
        this.linkedImg={}
        let d =document.createElement("div");
        let drop= document.createElement("i");
        let d1;
        if(!profiles.selected)
        {
            for(let k in this.profiles.profiles)
            {
                this.profiles.selected=k
                break;
            }
            
        }
        
        if(!this.profiles.selected)
        {
            this.profiles.profiles["none"]={name:"no account"};
            this.profiles.selected="none"
        }
        d1=this.createElement(profiles.profiles[profiles.selected].name,profiles.selected);   
        d.append(d1);
        drop.classList.add("fa-solid","fa-angle-down","text-4xl","align-middle","ml-2")
        d1.append(drop);
        this.selectedDOM=d1;
        this.SelectedDOMParent=d;
        d.classList.add("profil-picker")
        DOM.append(d);
        this.createList();
        let cont=this;
        d.addEventListener("click",(event)=>{

            if(cont.deployed)
            {
                cont.listDOM.style.display="none"                
                delete cont.deployed;
            }
            else
            {
                cont.deployed=true;
                cont.listDOM.style.display="inline"
            }
            event.stopPropagation(); 
        },true)
    }
    selected()
    {
        return this.profiles.selected;
    }
    loadProfiles(profile)
    {
        this.profiles=profile;
        this.selectedDOM.remove();
        this.selectedDOM= this.createElement(this.profiles.profiles[this.profiles.selected].name,this.profiles.selected);
        this.SelectedDOMParent.prepend(this.selectedDOM);
        this.SelectedDOMParent.click();
        this.listDOM.remove();
        this.createList();

    }
    updateIcon(id,url)
    {
        this.profiles.profiles[id].img=url;
        if(this.linkedImg[id])
            this.linkedImg[id].src=url;
    }
    createElement(text,id,small)
    {
        let cont=this;
        let d1 =document.createElement("div");
        if(small)
        {
        d1.addEventListener("click",(event)=>{
        cont.select(id);
        });
    }
        let img1=document.createElement("img");
        if(this.profiles.profiles[id].img)
        {
            img1.src=this.profiles.profiles[id].img;    
        }
        else
        img1.src=  Math.random()>0.5?"assets/alex.png":"assets/steve.png";
        this.linkedImg[id]=img1;
        d1.append(img1);
        let text1 =document.createElement("i");
        text1.innerText=text;
        text1.classList.add("m-2","text-2xl","align-middle","overflow-hidden");
        d1.append(text1);
        d1.classList.add(small?"profil-picker-small":"profil-picker-selected");
        img1.classList.add("h-full","inline","mr-2");
        let remmove =document.createElement("i");
        remmove.classList.add("fas","fa-times","text-red-800")
        d1.append(remmove);
        remmove.addEventListener("click",(event)=>{
            cont.deleteProfile(id);
            event.stopPropagation();
        })
        return d1;
    }

    deleteProfile(id)
    {
        delete this.profiles.profiles[id];
        window.send("deleteProfile",id);
        this.selectedDOM.remove();
        this.selectedDOM= this.createElement(this.profiles.profiles[this.profiles.selected].name,this.profiles.selected);
        this.SelectedDOMParent.prepend(this.selectedDOM);
        this.SelectedDOMParent.click();
        this.listDOM.remove();
        this.createList();
    }
    select(id)
    {
        this.profiles.selected = id;
    
        this.selectedDOM.remove();
        this.selectedDOM= this.createElement(this.profiles.profiles[this.profiles.selected].name,this.profiles.selected);
        this.SelectedDOMParent.prepend(this.selectedDOM);
        this.listDOM.remove()
        this.createList();
        this.SelectedDOMParent.click()
        window.send("pickProfile",id);

    }
    createList()
    {
        let d=document.createElement("div");
        d.classList.add("overflow-auto","h-40");
        for(let k in this.profiles.profiles)
        {
            if(this.profiles.selected != k)
            {
                let elemm =this.createElement(this.profiles.profiles[k].name,k,true);
                elemm.classList.add("profil-picker")
                    d.append(elemm);
            }
       
        }
        d.style.display="none"
        this.listDOM = d;
        this.dom.append(d);
        
    }



}