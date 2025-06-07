# SoundStep
---

## Intro
Soundstep is a real time interactive sonification system with a primary focus on sonifying walking and running. A set of modular and stackable algorithms can be used to detect and translate discrete and continuous data from a user into high level events that can then be used to modulate and trigger sounds within a rudimentary audio engine.

*Example use cases:*
- Augment / replace real sounds generated from running and walking (augmented viruality)
- Environmental recontextualization of running and walking sounds (indoor treadmill > outdoor gravel)
- Generate music totally synchronized to running and walking events
- Realtime and offline performance tracking
- Rehabilitation, gait intervention

Soundstep has two UI interafaces. The smartphone interface is for realtime data analysis, capture and sonification. The desktop sandbox interface is for inspecting/ visualizing collected data, debugging and testing different algorithms and sonification presets on recorded data.

## ToDo
- Create phone axis alignment tracking/ force data adjustment relative to axis rotation
- High level analysers:
    1. Stopped, Walk, Run, Other
    2. Dance (various styles)
- Use Hz from sensor API get more accurate timestamps
- Adjust sandbox playback to schedule audio events for more fidelity
- UX/ UI:
    1. User mode choices
    2. Presets
    3. ...
- Refine UI/ HTML & CSS for sandbox & phone modes
    1. Create lofi sketches for both modes, add link here
- Create real backend for data storage/ access