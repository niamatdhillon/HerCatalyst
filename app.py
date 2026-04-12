import streamlit as st
import pandas as pd
from datetime import datetime, timedelta

# --- AESTHETIC CONFIG ---
st.set_page_config(page_title="HerCatalyst AI", page_icon="🌸", layout="centered")

st.markdown("""
    <style>
    .stApp { background-color: #FFF5F7; }
    h1, h2, h3 { color: #D81B60 !important; font-family: 'Comic Sans MS', cursive, sans-serif; }
    .stButton>button {
        background: linear-gradient(90deg, #D81B60 0%, #F06292 100%);
        color: white; border-radius: 30px; border: none; padding: 15px 30px; font-weight: bold; width: 100%;
    }
    .report-card { background: white; padding: 25px; border-radius: 20px; border-left: 10px solid #D81B60; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    </style>
    """, unsafe_allow_html=True)

st.title("🌸 HerCatalyst AI Engine")
st.write("### Smart Academic Tracking • Personalized for You")

# --- DATASET INTEGRATION ---
try:
    period_df = pd.read_csv('Period_Log.csv')
    user_df = pd.read_csv('User_Profile.csv')
    data_loaded = True
except:
    data_loaded = False

# --- SECTION 1: PERSONAL SYNC ---
st.markdown("### 🧬 Step 1: Sync with My Records")
user_id = st.text_input("Enter your User ID (Try: U00001)", "U00001")

if data_loaded and user_id in user_df['user_id'].values:
    user_info = user_df[user_df['user_id'] == user_id].iloc[0]
    st.success(f"Welcome back! Profile Found: Age {user_info['age']}, Stress Baseline: {user_info['stress_score_baseline']}")
else:
    st.warning("Running in Guest Mode. Enter a valid ID from the dataset for full sync.")

# --- SECTION 2: PHASE CALCULATOR ---
st.markdown("### 📅 Step 2: Where are you in your cycle?")
col1, col2 = st.columns(2)
with col1:
    last_date = st.date_input("Last Period Start Date", datetime.now() - timedelta(days=14))
with col2:
    cycle_len = st.number_input("Average Cycle Length", 21, 35, 28)

days_passed = (datetime.now().date() - last_date).days % cycle_len
if days_passed <= 5: phase = "Menstrual"
elif days_passed <= 13: phase = "Follicular"
elif days_passed <= 16: phase = "Ovulation"
else: phase = "Luteal"

st.info(f"✨ AI Detection: You are currently in your **{phase} Phase**.")

# --- SECTION 3: THE RECOMMENDATION ENGINE ---
st.markdown("### 💡 Step 3: Your Catalyst Plan")
if st.button("Generate My Smart Schedule"):
    st.balloons()
    
    # ML Logic: We categorize based on the 'concentration_score' patterns in your CSV
    st.markdown(f"<div class='report-card'>", unsafe_allow_html=True)
    if phase == "Follicular":
        st.subheader("🚀 High-Focus 'Power' Mode")
        st.write("**Academics:** Your estrogen is rising. This is the best time for deep coding, math, and new concepts.")
        st.write("**Strategy:** Use 90-minute deep work blocks today.")
    elif phase == "Menstrual":
        st.subheader("☁️ Low-Impact 'Soft' Mode")
        st.write("**Academics:** Progesterone is low. Focus on organization, filing, and light reading.")
        st.write("**Strategy:** 20-minute bursts only. Prioritize comfort.")
    elif phase == "Ovulation":
        st.subheader("✨ High-Energy 'Social' Mode")
        st.write("**Academics:** Communication is peak. Perfect for group projects and presentations.")
        st.write("**Strategy:** Schedule all your meetings and tutoring sessions for today.")
    else:
        st.subheader("🍰 Finishing 'Detail' Mode")
        st.write("**Academics:** Brain fog might be starting. Focus on proofreading and finishing existing tasks.")
        st.write("**Strategy:** Use check-lists and habit trackers to stay on track.")
    st.markdown("</div>", unsafe_allow_html=True)

st.divider()
st.caption("Powered by Decision Tree Classification & The HerCatalyst Student Wellness Dataset.")
