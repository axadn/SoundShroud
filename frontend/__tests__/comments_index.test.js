import React from "react";
import Enzyme from 'enzyme';
import {shallow} from 'enzyme';
import Adapter from "enzyme-adapter-react-15";
import CommentsIndex from "../components/track/comments/comments_index";
Enzyme.configure({adapter: new Adapter()});

describe('comments index', ()=>{

    let wrapper;
    it("should ask the user to log in before commenting", ()=>{
        wrapper = shallow(<CommentsIndex loggedIn={false} comments={[]}/>);
        let input = wrapper.find("input");
        expect(input.html()).toEqual(expect.stringContaining("Please log in"));
    });
    it("should open up the auth modal if clicking without logging in", ()=>{
        const mockCallback = jest.fn();
        wrapper = shallow(<CommentsIndex enableLogin={mockCallback} loggedIn={false} comments={[]}/>);
        let input = wrapper.find("input");
        input.simulate('click',{currentTarget:{blur: ()=>{}}, preventDefault: ()=>{}});
        expect(mockCallback.mock.calls.length).toBe(1);
    });
    it("should update the input's text if logged in", ()=>{
        wrapper = shallow(<CommentsIndex loggedIn={true} comments={[]}/>);
        let input = wrapper.find("input");
        input.simulate('change', {target:{value: "asdfghjkl"}});
        input = wrapper.find("input");
        expect(input.html()).toEqual(expect.stringContaining("asdfghjkl"));
    });
});