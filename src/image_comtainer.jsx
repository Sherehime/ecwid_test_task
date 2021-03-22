
import React from "react";
import {BsInfoCircle} from "react-icons/bs";
import {RiArrowLeftSLine} from "react-icons/ri/index";
import {Link} from "react-router-dom";

import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

const SortableItem = SortableElement(({ value }) => {
    // console.log("index",key);
    return <div style={{ textAlign: 'center', width:'40%'}}>
        <div   style={{position:'relative' , textAlign: 'center'}}  >
            <img src={value} alt="Photo uploaded"  />

            <p className="photo-uploaded-num span1" style={{top:'2vh',left:'8%',color:'black', position: 'absolute',
                width: '4vh', height: '3vh', background: 'white',

                borderRadius: '50%',fontSize:'2vh'
            }}> </p>





            <svg className="photo-uploaded-delete"
                 style={{top:'2vh',right:'8%',color:'white', position: 'absolute',
                 }} width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path  d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3.46 8.88L4.87 7.47L7 9.59L9.12 7.47L10.53 8.88L8.41 11L10.53 13.12L9.12 14.53L7 12.41L4.88 14.53L3.47 13.12L5.59 11L3.46 8.88ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z" fill="#FF3629"/>
            </svg>

        </div>
    </div>


    /* <div
       style={{
        height: "60px",
        width: "50%",
        margin: "0",
      listStyleType:"none",
        display: "inline-block"}}
        style={{position:'relative' ,display: "inline-block", textAlign: 'center',width: '50%'}} ><img src={value}/>
    </div>;*/
});
//
const SortableList = SortableContainer(({ items }) => {
    // console.log('items',items);
    return (<div className={"new_photo-container"}>
            {items.map((value, index) => (
                <SortableItem key={index} index={index} value={value} />

            ))}
        </div>
    );
});

class image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ind:0,
            id: "upload-photo",
            imageArray: [],
            items: ['Item 1', 'Item 2'],
            loader:false,
            no_format:false,
        }



    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ imageArray }) => ({
            imageArray: arrayMove(imageArray, oldIndex, newIndex)
        }));
    };


    go_next(){




        this.setState({loader: true});
        if (this.state.imageArray.length==0){
            if(localStorage.getItem('imageArray')){}
            else{
                localStorage.setItem('imageArray','');

            }
            const { history } = this.props;
            history.push('/product_attributes');
        }
        else {
            const ber_token=localStorage.getItem('tokenData').replaceAll('"','');

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append("Authorization", "Bearer "+ ber_token );

            var urlencoded = new URLSearchParams();
            for (var i = 0; i < this.state.imageArray.length; i++) {
                urlencoded.append("base64Images["+i+"]",this.state.imageArray[i]);

            }

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch("https://sw.landpro.site/api/create-images-from-mobile-app", requestOptions)
                .then(response => response.text())
                .then(result =>


                    {
                        if (result.status==true)
                            this.setState({loader: false});
                        localStorage.setItem('imageArray',result);
                        const result_save=result;
                        //  console.log('result',result);
//data_save.length!=0?     result.images.concat(data_save):

                        localStorage.setItem('imageArray',result_save);

                        const { history } = this.props;
                        history.push('/product_attributes')

                    }
                )

                .catch(error => console.log('error', error));
        }}


    go_back(){
        localStorage.setItem('imageArray','');
        const { history } = this.props;
        history.push('/new_product');
        //  window.location.reload();

    }
    click_img(e){
        e.preventDefault();
        var array = [...this.state.imageArray]; // make a separate copy of the array
        var index = e.currentTarget.id-1;
        if (index !== -1) {
            array.splice(index, 1);
            this.setState({imageArray: array});
        }
    }

    buildImgTag(){
        var    for_map=[];
        if (localStorage.getItem('imageArray')!=''){
            var data_save=[];
            const imageArray=JSON.parse(localStorage.getItem('imageArray')).images;
            //  console.log(imageArray.images);
            data_save=Object.values(imageArray);
         //   console.log(data_save);
//const data_image=data_save.length==0? this.state.imageArray:data_save;
           // console.log(this.state.imageArray);
            //console.log(this.state.imageArray.concat(data_save));
            for_map=this.state.imageArray.concat(data_save);

        } else{
            for_map=this.state.imageArray;
        }
        var i=0;
        return <div className="photo-container">
            {

                for_map.map(imageURI =>
                    (
                        <div style={{ textAlign: 'center', width:'50%'}}>
                            <div className="photo-uploaded" key={i} id ={i} style={{position:'relative' , textAlign: 'center',width: '100%'}}  >
                                <img src={imageURI} key={i} id ={i} alt="Photo uploaded"  />

                                <p className="photo-uploaded-num span1" style={{top:'2vh',left:'8%',color:'black', position: 'absolute',
                                    width: '4vh', height: '3vh', background: 'white',

                                    borderRadius: '50%',fontSize:'2vh'
                                }}>{++i}  </p>

                                {this.state.loader==false ?



                                    <svg className="photo-uploaded-delete" id ={i} onClick={(e)=>this.click_img(e,i)}
                                         style={{top:'2vh',right:'8%',color:'white', position: 'absolute',
                                         }} width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path  d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3.46 8.88L4.87 7.47L7 9.59L9.12 7.47L10.53 8.88L8.41 11L10.53 13.12L9.12 14.53L7 12.41L4.88 14.53L3.47 13.12L5.59 11L3.46 8.88ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z" fill="#FF3629"/>
                                    </svg>
                                    : null}
                            </div>
                        </div>
                    ))
            }
        </div>
    }



    handleChange(e){
        this.readURI(e);
        if (this.props.onChange !== undefined) {
            this.props.onChange(e);
        }
    }



    readURI(e){
        var no_format=false;
        this.setState({no_format:false});
        const image_concat=this.state.imageArray;
        console.log('image_concat',image_concat);
        if (e.target.files) {
            const files = Array.from(e.target.files);
            Promise.all(files.map(file => {
                if(file.type.toLowerCase().includes('image/jpeg') ||file.type.toLowerCase().includes('image/jpg')||
                    file.type.toLowerCase().includes('image/png')||file.type.toLowerCase().includes('image/heic')){
                    return (new Promise((resolve,reject) => {
                        const reader = new FileReader();
                        reader.addEventListener('load', (ev) => {
                            resolve(ev.target.result);
                        });
                        reader.addEventListener('error', reject);
                        reader.readAsDataURL(file);
                    }));

                }else {this.setState({no_format:true});
                    this.setState({imageArray:[]});
                    no_format=true;
                    localStorage.setItem('imageArray','');
                    return false;}
            }))
                .then(images => {
                    if (no_format){
                        this.setState({imageArray:[]});
                    }else
                    {
                        this.setState({ imageArray :  images.concat(image_concat) });
                    }

                }, error => {
                    console.error(error);
                });
        }
    }


    render() {
        const imgTag = this.buildImgTag();

        return (
            <div className={"flex-container  "}>
                <div className={"flex-container__top_info"}>
                    <div className={"flex-container_header_message  col-12 "}>
                        <div className={"col-1"}>  <RiArrowLeftSLine onClick={()=>this.go_back()}/>  </div>
                        <div className={"col-10 "}>   <p className={" mp_p"}>Изображения товара</p>  </div>
                        <div className={"col-1"}> <Link to={"/info_card_image"}> <BsInfoCircle  className={"oferta_span"}/></Link> </div>
                    </div>

                    <div className={"margin_content"}  >
                        <div id="theRibbon">
                            <div className={"upload-btn-wrapper"}>
                                <button className={" btn-wrapper"}  >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={"mr-3"}>
                                        <path d="M18 2V14H6V2H18ZM18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM9.5 9.67L11.19 11.93L13.67 8.83L17 13H7L9.5 9.67ZM0 4V18C0 19.1 0.9 20 2 20H16V18H2V4H0Z" fill="white"/>
                                    </svg>
                                    Загрузить изображение</button>
                                <input
                                    id={this.state.id}
                                    type="file"
                                    name=""
                                    accept="image/jpeg,image/jpg,image/png"
                                    title="Add photos"
                                    onChange={this.handleChange.bind(this)}
                                    multiple
                                />
                                <label htmlFor={this.state.id}>
                                    {this.state.imageArray.length == 0 ?  <small> {this.state.imageArray.length} изображений</small>:
                                        [(this.state.imageArray.length == 1? <small> {this.state.imageArray.length} изображение</small>:
                                            <small> {this.state.imageArray.length} изображения</small>  )]}



                                </label>
                            </div>
                            {this.state.no_format==false?imgTag:<p className={"message_invalid"}>Данный формат не поддерживается</p>}


                        </div>
                    </div>

                    {/*  <h3>     разобраться со стилями</h3>
                    {this.state.imageArray.length > 0 ?
                    <div className={"margin_content"}>
                        <SortableList
                            axis="xy"
                            items={this.state.imageArray}
                            onSortEnd={this.onSortEnd}
                        />
                    </div>
                    :null}*/}

                </div>
                <div className={"bottom_info"}>
                    <div className={" margin_content"}>
                        {this.state.loader == false ?
                            <button className={"btn_cheked"} type={"submit"} onClick={()=>this.go_next()}>
                                ДАЛЕЕ
                            </button> :

                            <button className={"btn_cheked_disabled"} type={"submit"} disabled={true}>
                                ИДЕТ ЗАГРУЗКА, ОЖИДАЙТЕ
                            </button>
                        }

                    </div>
                </div>
            </div>

        );
    }
}

export default image;

