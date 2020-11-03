from tkinter import *
from PIL import Image,ImageTk
from selenium import webdriver
import tkinter.messagebox as tmsg

root=Tk()
height=820
width=680
root.geometry(f"{height}x{width}")
root.title("Instagram Profile Picture Download")

def download():
    cd='C:\\webdrivers\\chromedriver.exe'

    driver = webdriver.Chrome(cd) 

    user_h=userName.get()
    url='https://www.instagram.com/'
    url_p=url+user_h

    driver.get(url_p)

    try:
        image=driver.find_element_by_xpath('//img[@class="_6q-tv"]')
    except:
        image=driver.find_element_by_xpath('//img[@class="be6sR"]')

    img_link=image.get_attribute('src')

    if location.get() == 0:
        path="C:\\Users\\milan\\Desktop\\"+user_h+".jpg"
    elif location.get() == 1:
        path="D:\\"+user_h+".jpg"
    
    import urllib.request

    urllib.request.urlretrieve(img_link,path)

    tmsg.showinfo("Downloaded",f"the profile picture is downloaded at {path}")


f1=Frame(root,height=height-220,width=width-280,relief=SUNKEN,borderwidth=8)
f1.pack(pady=50)

logo=Image.open("insta.png")
logo=logo.resize((360,250),Image.ANTIALIAS)
logo_img=ImageTk.PhotoImage(logo)
Label(f1,image=logo_img).pack()

logo2=Image.open("instagram_logo2.png")
logo2=logo2.resize((260,60),Image.ANTIALIAS)
logo2_img=ImageTk.PhotoImage(logo2)
Label(f1,image=logo2_img).pack()

Label(f1,text="Enter username below: ",font="comicsansms 10 bold",fg="DodgerBlue4").pack()
userName=StringVar()

Entry(f1,textvariable=userName,borderwidth=4,relief=RIDGE).pack(pady=10)

Label(f1,text="Select Location :").pack()
location=IntVar()
locations=["Desktop","D disk"]
for i,item in enumerate(locations):
    Radiobutton(f1,text=item,variable=location,value=i,fg="chocolate2").pack(pady=2)

Button(f1,text="Download",bg="sky blue",command=download).pack(pady=20)

root.mainloop()
