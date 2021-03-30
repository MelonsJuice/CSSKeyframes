<img src="./icons-imgs/logo.png" style="width: 240px"/>
<br/>
<br/>

# [Install React App](#install-keyframess-react-app)

# Documentation

- [Insert or remove a property](#insert-or-remove-a-property)
- [Edit a property](#edit-a-property)
- [Add or remove a keyframe](#add-or-remove-a-keyframe)
- [Move a keyframe](#move-a-keyframe)
- [Edit animation keyframes timing](#edit-animation-keyframes-timing)
- [Edit animation properties](#edit-animation-properties)
- [Select, create or delete an animation](#select,-create-or-delete-an-animation)
- [Play, restart and update animations](#play,-restart-and-update-animations)
- [Change animation class name](#change-animation-class-name)
- [Edit dummy code](#edit-dummy-code)
- [Get animation code](#get-animation-code)

---

<br/>

## **Insert or remove a property**

`INSERT`:
go to **PROPERTIES LIST** and click on the property you want to add

`REMOVE`: go to **CURRENT PROPERTIES** and click the ![image](./icons-imgs/minus.png) icon in the property you want to remove

#### `PROPERTIES TYPE`:

properties have been divided into 2 types:

- **normal:** or indipendent properties (ex: border, width, top, ecc...)

- **grouped:** or properties which belong to another property (ex: transform)

> grouped properties are preceded by the icon ![image](./icons-imgs/group.png) and are placed in the _CURRENT PROPERTIES_ under the group to which they belong (the name is highlighted in purple)
>
> **WARNING:** the grouped properties all have the same animation, if the animation in one is changed, the others will be updated as well

<br/>

---

<br/>

## **Edit a property**

go to **CURRENT PROPERTIES** and click the ![image](./icons-imgs/edit.png) icon in the property you want to edit

> **NOTE:** The added property will be assigned the current animation (in the case of grouped properties, the animation of the group will be assigned).  
> the preview will be initialized with the values of the first keyframe

**PROPERTY PANEL:** contains the values of the selected property in the various frames, here you can edit:

- values (of course)

- unit (if the property has)

- #### animation

  > **WARNING:** When you change animation, some values could be removed or added according to the number of frames owned by the new animation
  >
  > If the selected property is of [grouped](#properties-type) type, the modification is carried out on all the elements of the group
  >
  > **NOTE:** to see the preview of an inserted value, click on the keyframe in the [keyframes](#add-or-remove-a-keyframe) bar corresponding to the value you want to view

**PROPERTY PANEL transform tool:** transform tool allows you to perform different operations on all frame values:

- **scale:** multiply all values for an inserted number (only works for numerical values)

- **offset:** add the inserted number to all values (only works for numerical values)

- **reverse:** rearranges all values in reverse

> **NOTE:** if the new value is out of range (ex: opacity < 0 or > 1), it will be rounded to the nearest acceptable value

<br/>

---

<br/>

## **Add or remove a keyframe**

`ADD`: click the button ![image](./icons-imgs/plus.png) (next to the purple bar) for enter in add mode (the button will be filled with purple), next go to the keyframes bar and click on the point where you want to insert the frame (a preview will show you the position of the new keyframe)

> **NOTE:** The new inserted keyframe will divide the transition of the 2 neighboring keyframes at the point where the insertion takes place, thus maintaining the original animation pattern

<br/>

`REMOVE`: click the button ![image](./icons-imgs/minus.png) (next to the purple bar) for enter in remove mode (the button will be filled with purple), next go to the keyframes bar and click the keyframe you want to remove

> **NOTE:** Everytime you click a keyframe, the **TIMING PANEL** will be updated with the timing function between the selected keyframe and its next one

<br/>

---

<br/>

## **Move a keyframe**

Grab the keyframe you want to move and move it with the mouse (make sure you are in edit mode),
the selected frame can be moved in the range created by the keyframe before and after it

> **EDIT MODE**: To enter edit mode, turn off the colored button if there is one, if not, well... you are already in edit mode

<br/>

---

<br/>

## **Edit animation keyframes timing**

Select the first of the 2 keyframes of which you want to modify the timing function, then go to the **TIMING PANEL** (the panel with the curve) where you can:

- edit the curve (by changing the coordinates of the points through the gui or by entering the coordinates in the inputs below)

- select a curve preset (with the drop menu on the top)

<br/>

---

<br/>

## **Edit animation properties**

next to the keyframes bar there are several input and drop menus that will allow you to change the properties of the current animation.  
Of these properties, repeat and delay have one more option:

- ![image](./icons-imgs/infinity.png) for repeat, allows you to select either a number or infinity

- ![image](./icons-imgs/repeat.png) for delay, allows you to repeat the delay between one iteration and another
  > **WARNING:** The delay repetition is not present in css animations, what this option does is "[fake a delay](https://css-tricks.com/css-keyframe-animation-delay-iterations/)", so in combination with other options like "direction: reverse" the delay could work differently

<br/>

---

<br/>

## **Select, create or delete an animation**

`SELECT`: go to the animation drop menu (on the top right) and select the animation you want to edit

> **NOTE:** Everytime you change the animation, the preview will be initialized with the values of the first keyframe

`CREATE`: go to the animation drop menu and click the ![image](./icons-imgs/plus.png) icon on the left

`DELETE`: go to the animation drop menu and click the ![image](./icons-imgs/minus.png) icon on the left

> **WARNING:** The animated properties from the deleted animation will be moved (and if necessary [modified](#animation)) to the first animation in the list

<br/>

---

<br/>

## **Play, restart and update animations**

`PLAY / PAUSE`: click the ![image](./icons-imgs/play.png) icon (on the top right) to play or pause the animations

`RESTART`: click the ![image](./icons-imgs/restart.png) icon (always on the top rigth) to restart the animations

> **NOTE: Remember to restart the animations once they are finished, otherwise the preview may not work every time a keyframe is clicked or a value is changed**
>
> To help you understand when to restart, the icon will be colored purple.

`UPDATE`: click the _Update_ button (Well... by now you know where) to update the animations with the new values

> **NOTE:** to help you keep track of when changes occur, the button will be filled with purple

<br/>

---

<br/>

## **Change animation class name**

go to the _.class_ button (on the top right) and enter the name in the first input field

> **NOTE:** if invalid characters are inserted during writing, they will not be inserted

<br/>

---

<br/>

## **Edit dummy code**

go to the _.dummy_ button (on the top right) and and choose between html and css, once the code has been modified, press the apply change button to apply the changes

<br/>

---

<br/>

## **Get animation code**

go to the _.class_ button (on the top right) and copy the class name to add to your element, and the code to copy on your css file

<br/>
<br/>
<br/>
<br/>

# Install KeyFramess React App

After downloading the code, remove the _package-lock.json_ file, then open the terminal in the project folder and type:

## **For install dependencies**

    npm install

## **For runs the application**

    npm start
