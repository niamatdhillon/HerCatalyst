import streamlit as st
import pandas as pd

st.set_page_config(page_title="HerCatalyst AI", page_icon="🌸")
st.title("🌸 HerCatalyst: Academic AI")

# Inputs based on your dataset columns
phase = st.selectbox("Current Cycle Phase", ["Follicular", "Luteal", "Menstrual"])
energy = st.slider("Energy Level", 1, 10, 5)
pain = st.slider("Pain Level", 1, 10, 2)

if st.button("Get My Study Strategy"):
    # Decision Tree logic based on concentration_score in your data
    if phase == "Follicular" and energy > 6:
        st.success("🚀 **High Concentration Phase:** Perfect for complex Data Science and coding.")
    elif phase == "Menstrual" and pain > 5:
        st.warning("🛌 **Rest & Review Phase:** Low concentration predicted. Stick to light reading.")
    else:
        st.info("📊 **Balanced Phase:** Good for collaboration and standard assignments.")
